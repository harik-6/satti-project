import os
from typing import Annotated

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

import convertor
from extractor import format_ai_text
from models import SelectFund, SelectFundResponse, SelectFundRequest, BsRequest, BsResponse, StatementResponse, \
    TagResponse, TagRequest
from select_funds import select_funds
from spend_behaviour import spend_behaviour
from spend_tagging.tag_api import add_tag, get_tags, update_tag

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/health")
def health():
    return {"Health": "OK"}

@app.post("/classify/behaviour")
async def classify_behaviour(file: UploadFile = File(...)):
    try:
        if not file or not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        if not file.filename.lower().endswith(('.csv', '.xlsx')):
            raise HTTPException(status_code=400, detail="Only CSV and XLSX files are allowed")

        content = await file.read()

        if file.filename.lower().endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))

        if len(df.columns) != 2:
            raise HTTPException(status_code=400, detail="File should only have 2 columnts")


        result_dict = {}
        first_col = df.iloc[:, 0]
        second_col = df.iloc[:, 1]

        user_prompt = "This is how my monthy finance looks like and I spend "

        for i in range(len(df)):
            key = str(first_col.iloc[i]) if pd.notna(first_col.iloc[i]) else ""
            value = str(second_col.iloc[i]) if pd.notna(second_col.iloc[i]) else ""
            if key == "income":
                user_prompt += f" and my Income is {value}."
            elif key == "savings":
                user_prompt += f" and I save {value}."
            elif key == "investment":
                user_prompt += f" and I Invest {value}."
            else:
                user_prompt += f"{value} on {key} "
            result_dict[key] = value

        user_prompt += " What kind of spender I am? Respond to me in 100 words"

        assistant_response = await spend_behaviour.classify_behaviour(user_prompt)

        return {
            "filename": file.filename,
            "data": result_dict,
            "user_prompt": user_prompt,
            "assistant_response": assistant_response
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.post("/classify/behaviour/short", response_model=BsResponse)
async def classify_fund(body: BsRequest):
    extracted = await format_ai_text(body.behaviour, "Spender type Conservative, Moderate, Aggressive. Just give me one word response")
    print(f"Extracted: {extracted}")
    return BsResponse(status="success", payload=extracted)

@app.post("/select/funds", response_model=SelectFundResponse)
async def classify_fund(body: SelectFundRequest):
    recommendation =  await select_funds.select_funds()
    return SelectFundResponse(status="success", payload=recommendation)

@app.post("/statement/tag", response_model=StatementResponse)
async def tag_statement(file: Annotated[UploadFile , Form()] = None, bank: Annotated[str , Form()] = "NA"):
    if bank == "NA" or file is None:
        raise HTTPException(status_code=400, detail="Bank not provided")

    try:
        file_path = "./uploaded_files/" + file.filename
        with open(file_path, 'w') as f:
            f.write(file.file.read().decode('utf-8'))
        transactions = convertor.convert_hdfc_statement_to_transactions(file_path)
        return StatementResponse(status="success", id="" , transactions=transactions, bank=bank)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")



# TAG API
@app.post("/tag", response_model=TagResponse)
async def add_tag_endpoint(body: TagRequest):
    print(f"Tagging {body.narration} as {body.category}")
    await add_tag(body)
    return TagResponse(status="success", payload=[])

@app.get("/tag")
async def get_all_tags():
    tags = await get_tags()
    return TagResponse(status="success", payload=tags)

@app.put("/tag/{id}/{category}")
async def update_tag_by_id(id: str, category: str):
    tags = await update_tag(id, category)
    return TagResponse(status="success", payload=tags)