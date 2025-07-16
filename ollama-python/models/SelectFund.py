from pydantic import BaseModel

class SelectFundRequest(BaseModel):
    behaviour: str

class SelectFundResponse(BaseModel):
    status: str
    payload: str