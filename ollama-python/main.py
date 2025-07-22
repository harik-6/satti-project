from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import AllocationResponse, TagResponse, BehaviourResponse
import services.funds_service as funds_service
import services.tag_service as tag_service
import services.behaviour_service as behaviour_service
import services.extractor_service as extractor_service
import services.portfolio_service as portfolio_service

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
async def classify_fund(body: AllocationResponse):
    recommendation =  await funds_service.select_funds(body.allocation_text)
    return ""
#
# @app.get("/portfolio")
# async def portfolio():
#     sample_text = "Low Risk Fund (Fixed Income): UTI Corporate Bond Fund from UTI Asset Management Co. Ltd. with a Beta of 0.8, indicating lower volatility. High Risk Fund (Equity): Tata Small Cap Fund from Tata Asset Management, with a high standard deviation of 13.94, suggesting higher risk and potential for higher returns. Low Risk Fund (Fixed Income): Tata Treasury Advantage Fund from Tata Asset Management, which is a low duration fund and has a standard deviation of only 0.25, indicating lower volatility and lower risk"
#     fund_names = await extractor_service.format_ai_text(sample_text, "List of funds. Just give me the list of mutual fund names without the fund house name in comma separated format and nothing else")
#     print("Fund names extracted: ", fund_names)
#     fund_list = []
#     for fund in fund_names.split(","):
#         fund_list.append(fund.strip())
#     portfolio_summary = await portfolio_service.generate_portfolio_summary(fund_list)
#     return {"status": "success", "payload": portfolio_summary}