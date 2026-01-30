from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

class ChatResponse(BaseModel):
    response: str
    access_granted: bool
    vault_balance: Optional[str] = None

class ClaimRequest(BaseModel):
    destination_address: str
    passphrase: str # Simple protection, though logic is handled by "access_granted" state in a real app or session

class WalletStatus(BaseModel):
    address: str
    balance: str
    network: str
