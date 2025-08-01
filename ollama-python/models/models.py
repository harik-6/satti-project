from pydantic import BaseModel
from beanie import Document

class UploadResponse(BaseModel):
    flow_id: str
    status: str

class TagResponse(BaseModel):
    flow_id: str
    status: str
    transactions: list

class BehaviourResponse(Document):
    flow_id: str
    status: str
    behaviour: str
    behaviour_short: str

    class Settings:
        name = "behaviour_response"

class AllocationResponse(Document):
    flow_id: str
    status: str
    allocation_text: str
    allocation_perc: str

    class Settings:
        name = "allocation_response"

class RecommendationResponse(Document):
    flow_id: str
    status: str
    recommendation: str

    class Settings:
        name = "recommendation_response"