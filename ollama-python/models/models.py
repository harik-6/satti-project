from pydantic import BaseModel

class TagResponse(BaseModel):
    status: str
    transactions: list

class BehaviourResponse(BaseModel):
    status: str
    behaviour: str
    behaviour_short: str

class AllocationResponse(BaseModel):
    status: str
    allocation_text: str
    allocation_perc: dict

class RecommendationResponse(BaseModel):
    status: str
    recommendation: str