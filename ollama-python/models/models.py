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

# # Select Fund Models
# class SelectFundRequest(BaseModel):
#     behaviour: str
#
# class SelectFundResponse(BaseModel):
#     status: str
#     payload: str