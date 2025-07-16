from pydantic import BaseModel

class StatementResponse(BaseModel):
    status: str
    id: str
    bank: str
    transactions: list