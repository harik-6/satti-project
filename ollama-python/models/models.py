from pydantic import BaseModel

class BehaviourResponse(BaseModel):
    status: str
    behaviour: str
    behaviour_short: str

# Select Fund Models
class SelectFundRequest(BaseModel):
    behaviour: str

class SelectFundResponse(BaseModel):
    status: str
    payload: str

class TagResponse(BaseModel):
    status: str
    payload: list
