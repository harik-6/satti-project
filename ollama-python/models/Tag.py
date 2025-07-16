from pydantic import BaseModel

class TagRequest(BaseModel):
    narration: str
    category: str

class TagResponse(BaseModel):
    status: str
    payload: list