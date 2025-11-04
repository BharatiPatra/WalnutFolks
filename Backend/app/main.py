from fastapi import FastAPI
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
from .database import supabase_client
from .schemas import WebhookRequest, TransactionResponse
from .utils import process_transaction_sync

app = FastAPI()
executor = ThreadPoolExecutor(max_workers=5)  # Background thread pool

@app.get("/")
def health_check():
    return {
        "status": "HEALTHY",
        "current_time": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/webhooks/transactions", status_code=202)
async def webhook_handler(payload: WebhookRequest):
    existing = supabase_client.table("transactions").select("*").eq("transaction_id", payload.transaction_id).execute()

    if not existing.data:
        supabase_client.table("transactions").insert({
            **payload.__dict__,
            "status": "PROCESSING",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "processed_at": None,
        }).execute()

        # Queue task in executor
        executor.submit(process_transaction_sync, payload.transaction_id)

    return {"message": "Accepted"}

@app.get("/v1/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction_status(transaction_id: str):
    result = supabase_client.table("transactions").select("*").eq("transaction_id", transaction_id).execute()
    if not result.data:
        return {"error": "Not Found"}
    return result.data[0]
