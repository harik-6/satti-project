from typing import Annotated

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from services.extractor_service import format_ai_text
from models import  SelectFundResponse, SelectFundRequest, BsRequest, BsResponse, StatementResponse, \
    TagResponse
from select_funds import select_funds
import services.tag_service as tag_service
from spend_behaviour import spend_behaviour
# from services.tag_service import  get_tags, update_tag

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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file or not file.filename or not file.filename.lower().endswith(('.csv', '.txt')):
            raise HTTPException(status_code=400, detail="Missing file or invalid file format")
        content = await file.read()
        file_name = "statement.txt"
        with open(f"uploaded_files/{file_name}", "wb") as f:
            f.write(content)
            print(f"File {file.filename} written to disk successfully")

        tagged =  await tag_service.categorize_tags(file_name)
        return TagResponse(status="success", payload=tagged)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing financial statement file: {str(e)}")

@app.post("/classify/behaviour")
async def classify_behaviour(body: TagResponse):
    print(f"Classifying behaviour: {body.payload}")
    try:
        # user_prompt = "This is how my monthy finance looks like and I spend "
        #
        # for i in range(len(df)):
        #     key = str(first_col.iloc[i]) if pd.notna(first_col.iloc[i]) else ""
        #     value = str(second_col.iloc[i]) if pd.notna(second_col.iloc[i]) else ""
        #     if key == "income":
        #         user_prompt += f" and my Income is {value}."
        #     elif key == "savings":
        #         user_prompt += f" and I save {value}."
        #     elif key == "investment":
        #         user_prompt += f" and I Invest {value}."
        #     else:
        #         user_prompt += f"{value} on {key} "
        #     result_dict[key] = value
        #
        # user_prompt += " What kind of spender I am? Respond to me in 100 words"
        #
        # assistant_response = await spend_behaviour.classify_behaviour(user_prompt)

        return {
            "user_prompt": "user_prompt",
            "assistant_response": "assistant_response"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error classifying behaviour: {str(e)}")

@app.post("/classify/behaviour/short", response_model=BsResponse)
async def classify_fund(body: BsRequest):
    extracted = await format_ai_text(body.behaviour, "Spender type Conservative, Moderate, Aggressive. Just give me one word response")
    print(f"Extracted: {extracted}")
    return BsResponse(status="success", payload=extracted)

@app.post("/select/funds", response_model=SelectFundResponse)
async def classify_fund(body: SelectFundRequest):
    recommendation =  await select_funds.select_funds()
    return SelectFundResponse(status="success", payload=recommendation)