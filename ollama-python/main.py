from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import services.funds_service as funds_service
import services.tag_service as tag_service
import services.behaviour_service as behaviour_service
import services.extractor_service as extractor_service
import services.portfolio_service as portfolio_service
from models.models import RecommendationResponse, AllocationResponse, TagResponse, BehaviourResponse

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
        return TagResponse(status="success", transactions=tagged)

    except Exception as e:
        e.print_stack()
        raise HTTPException(status_code=500, detail=f"Error processing financial statement file: {str(e)}")

@app.post("/classify/behaviour")
async def classify_behaviour(body: TagResponse):
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
        behaviour_short = await extractor_service.format_ai_text(behaviour, "Spender type Conservative, Moderate, Aggressive. Just give me one word response")
        return BehaviourResponse(status="success", behaviour=behaviour, behaviour_short=behaviour_short)

    except Exception as e:
        print("Error classifying behaviour: ", e)
        raise HTTPException(status_code=500, detail=f"Error classifying behaviour: {str(e)}")


@app.post("/allocate")
async def extract_funds(body: BehaviourResponse):
    allocation_text = await funds_service.allocate_fund_by_percentage(body.behaviour_short)
    gold_perc = await extractor_service.format_ai_text(allocation_text, "Percentage of gold. Just give me the percentage number without percentage sign and nothing else")
    mf_fund_type = await extractor_service.format_ai_text(allocation_text, "Type of mutual fund equity or debt Just give me in one word like debt or equity and nothing else")
    mf_perc = await extractor_service.format_ai_text(allocation_text, "Percentage of mutual fund. Just give me the percentage number without percentage sign and nothing else")
    allocation_perc = {"gold": gold_perc, "mf_perc": mf_perc, "mf_type": mf_fund_type}
    return AllocationResponse(status="success", allocation_text=allocation_text, allocation_perc=allocation_perc)


@app.post("/recommend")
async def recommend_funds(body: AllocationResponse):
    recommendation =  await funds_service.get_recommended_funds(body.allocation_text)
    return RecommendationResponse(status="success", recommendation=recommendation)

@app.get("/portfolio")
async def portfolio():
    sample_text = ("Based on the recommended allocation strategy, I recommend the following funds:\n\n**Debt/Conservative Hybrid Mutual Funds (70%):**\n"
                   "I suggest allocating to Axis Liquid Fund  Direct Plan (Growth) with a 1-year CAGR of 0.0126"
                   "And also Invest in HDFC Nifty 50 Index Fund with a 3-year cagr of 0.0805 and also UTI Nifty Next 50 Index Fund with a 5-year cagr of 0.1025")
    fund_names = await extractor_service.format_ai_text(sample_text, "From the text just give the names of mutual funds with comma seperated")
    fund_list = []
    for fund in fund_names.split(","):
        fund_list.append(fund.strip())
    print("Fund list : ", fund_list)
    portfolio_summary = await portfolio_service.generate_portfolio_summary(fund_list)
    return {"status": "success", "portfolio": portfolio_summary}