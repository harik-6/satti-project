from pydantic import BaseModel

class BsRequest(BaseModel):
    behaviour: str

class BsResponse(BaseModel):
    status: str
    payload: str