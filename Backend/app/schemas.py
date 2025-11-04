from dataclasses import dataclass
from typing import Optional

@dataclass
class WebhookRequest:
    transaction_id: str
    source_account: str
    destination_account: str
    amount: float
    currency: str

@dataclass
class TransactionResponse(WebhookRequest):
    status: str
    created_at: str
    processed_at: Optional[str] = None
