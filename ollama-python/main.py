import json

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid

import services.funds_service as funds_service
import services.tag_service as tag_service
import services.behaviour_service as behaviour_service
import services.extractor_service as extractor_service
import services.portfolio_service as portfolio_service
from models.models import UploadResponse, TagResponse, BehaviourResponse, AllocationResponse, RecommendationResponse

from beanie import init_beanie
import motor.motor_asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def init_db():
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            "mongodb+srv://investmentui:x5wZ0tEdMepDReuw@cluster0.jyigj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        await init_beanie(database=client.investmentui, document_models=[BehaviourResponse, AllocationResponse, RecommendationResponse])
        print("Db connected successfully")
    except Exception as e:
        print("Error connecting to DB: ", e)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/health")
def health():
    return {"Health": "OK"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    flow_id = str(uuid.uuid4())
    try:
        if not file or not file.filename or not file.filename.lower().endswith(('.csv', '.txt')):
            raise HTTPException(status_code=400, detail="Missing file or invalid file format")
        content = await file.read()
        file_name = f"{flow_id}.txt"
        with open(f"resources/{file_name}", "wb") as f:
            f.write(content)
            print(f"File {file.filename} written to disk successfully")
        return UploadResponse(flow_id=flow_id, status="success")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing financial statement file: {str(e)}")

@app.get("/tag")
async def tag_transactions(flow_id: str):
    try:
        file_name = f"{flow_id}.txt"
        tagged_json =  await tag_service.categorize_tags(file_name)
        tag_response = TagResponse(flow_id=flow_id, status="success", transactions=tagged_json)
        return tag_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tagging transactions /GET: {str(e)}")

@app.post("/tag")
async def tag_transactions(body: TagResponse):
    if not body.flow_id or not body.transactions:
        raise HTTPException(status_code=400, detail="Flow id/Transactions missing in request body")
    try:
        tagged_file_name = f"tagged_{body.flow_id}.json"
        with open(f"resources/{tagged_file_name}", "w") as f:
            json.dump(body.transactions, f, indent=2)
        return TagResponse(flow_id=body.flow_id, status="success", transactions=body.transactions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing financial statement file: {str(e)}")

@app.post("/behaviour")
async def classify_behaviour(flow_id: str):
   tagged_file_name = f"tagged_{flow_id}.json"
   with open(f"resources/{tagged_file_name}", "r") as f:
       transactions = json.load(f)
   body = TagResponse(flow_id=flow_id, status="success", transactions=transactions)
   try:
       sum_by_category = {}
       for transaction in body.transactions:
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
       behaviour_short = await extractor_service.format_ai_text(behaviour,
                                                                "Spender type Conservative, Moderate, Aggressive. Just give me one word response")
       behaviour_response = BehaviourResponse(flow_id=body.flow_id, status="success", behaviour=behaviour,
                                              behaviour_short=behaviour_short)
       await behaviour_response.create()
       return behaviour_response
   except Exception as e:
       print("Error classifying behaviour: ", e)
       raise HTTPException(status_code=500, detail=f"Error classifying behaviour: {str(e)}")

@app.post("/allocate")
async def extract_funds(flow_id: str):
    body = await BehaviourResponse.find_one({"flow_id": flow_id})
    allocation_text = await funds_service.allocate_fund_by_percentage(body.behaviour_short)
    gold_perc = await extractor_service.format_ai_text(allocation_text, "Percentage of gold. Just give me the percentage number without percentage sign and nothing else")
    mf_fund_type = await extractor_service.format_ai_text(allocation_text, "Type of mutual fund equity or debt Just give me in one word like debt or equity and nothing else")
    mf_perc = await extractor_service.format_ai_text(allocation_text, "Percentage of mutual fund. Just give me the percentage number without percentage sign and nothing else")
    allocation_perc = f"Gold={gold_perc},{(mf_fund_type.strip().capitalize())}={mf_perc}"
    allocation_response = AllocationResponse(flow_id=flow_id, status="success", allocation_text=allocation_text, allocation_perc=allocation_perc)
    await allocation_response.create()
    return allocation_response

@app.post("/recommend")
async def recommend_funds(flow_id: str):
    body = await AllocationResponse.find_one({"flow_id": flow_id})
    recommendation =  await funds_service.get_recommended_funds(body.allocation_text)
    recommendation_response = RecommendationResponse(flow_id=flow_id ,status="success", recommendation=recommendation)
    await recommendation_response.create()
    return recommendation_response

@app.post("/portfolio")
async def portfolio(flow_id: str):
    body = await RecommendationResponse.find_one({"flow_id": flow_id})
    if not body:
        raise HTTPException(status_code=400, detail="No recommendation found for the flow id")
    fund_names = await extractor_service.format_ai_text(body.recommendation, "From the text just give the names of mutual funds with comma seperated")
    fund_list = []
    for fund in fund_names.split(","):
        fund_list.append(fund.strip())
    portfolio_summary = await portfolio_service.generate_portfolio_summary(fund_list)
    return {"status": "success", "portfolio": portfolio_summary}

