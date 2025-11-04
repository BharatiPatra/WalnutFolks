from datetime import datetime, timezone
from .database import supabase_client
import time

def process_transaction_sync(transaction_id: str):
    print(f"Started processing {transaction_id}")
    time.sleep(30)  # Simulate 30-second delay

    supabase_client.table("transactions").update({
        "status": "PROCESSED",
        "processed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("transaction_id", transaction_id).execute()
    print(f"Finished {transaction_id}")
