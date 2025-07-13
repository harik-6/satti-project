from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from spend_behaviour import spend_behaviour

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
    print(file)
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

        user_prompt += " What kind of spender I am?"

        assistant_response = await spend_behaviour.classify_behaviour(user_prompt)

        return {
            "filename": file.filename,
            "data": result_dict,
            "user_prompt": user_prompt,
            "assistant_response": assistant_response
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
