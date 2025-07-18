from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import SelectFundResponse, SelectFundRequest, TagResponse, BehaviourResponse
import services.funds_service as funds_service
import services.tag_service as tag_service
import services.behaviour_service as behaviour_service
import services.extractor_service as extractor_service


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
        e.print_stack()
        raise HTTPException(status_code=500, detail=f"Error processing financial statement file: {str(e)}")

@app.post("/classify/behaviour")
async def classify_behaviour(body: TagResponse):
    try:
        sum_by_category = {}
        for transaction in body.payload:
            category = transaction.get("category", "untagged")
            credit = float(transaction.get("credit", "0.00"))
            debit = float(transaction.get("debit", "0.00"))
            total_sum = debit + credit
            if total_sum > 0:
                if category in sum_by_category:
                    sum_by_category[category] += total_sum
                else:
                    sum_by_category[category] = total_sum

        behaviour = await behaviour_service.classify_behaviour(sum_by_category)
        behaviour_short = await extractor_service.format_ai_text(behaviour, "Spender type Conservative, Moderate, Aggressive. Just give me one word response")
        return BehaviourResponse(status="success", behaviour=behaviour, behaviour_short=behaviour_short)

    except Exception as e:
        print("Error classifying behaviour: ", e)
        raise HTTPException(status_code=500, detail=f"Error classifying behaviour: {str(e)}")

@app.post("/select/funds", response_model=SelectFundResponse)
async def classify_fund(body: SelectFundRequest):
    recommendation =  await funds_service.select_funds(body.behaviour)
    return SelectFundResponse(status="success", payload=recommendation)