from stellar_sdk import Server, Keypair, Network, TransactionBuilder, Asset
import os
import requests
from dotenv import load_dotenv

load_dotenv()

class StellarService:
    def __init__(self):
        self.secret_key = os.getenv("STELLAR_SECRET_KEY")
        self.public_key = os.getenv("STELLAR_PUBLIC_KEY")
        self.horizon_url = os.getenv("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
        
        # If no keys, generate ephemeral ones (or in real app, error out)
        if not self.secret_key:
            print("WARNING: No Stellar Keys found. Generating temporary keys for session.")
            kp = Keypair.random()
            self.secret_key = kp.secret
            self.public_key = kp.public_key
            print(f"TEMP KEYS - Public: {self.public_key}")
            print(f"TEMP KEYS - Secret: {self.secret_key}")
            # Auto-fund
            self.fund_account()

        self.server = Server(horizon_url=self.horizon_url)

    def fund_account(self):
        print(f"Funding account {self.public_key} via Friendbot...")
        try:
            response = requests.get(f"https://friendbot.stellar.org?addr={self.public_key}")
            if response.status_code == 200:
                print("Funding successful!")
            else:
                print(f"Funding failed: {response.text}")
        except Exception as e:
            print(f"Error funding account: {e}")

    def get_balance(self) -> str:
        try:
            account = self.server.accounts().account_id(self.public_key).call()
            for balance in account['balances']:
                if balance['asset_type'] == 'native':
                    return balance['balance']
            return "0.0"
        except Exception as e:
            return f"Error: {str(e)}"

    def send_payment(self, destination: str, amount: str = "10.0") -> str:
        try:
            # Load source account
            source_account = self.server.load_account(account_id=self.public_key)
            
            # Build transaction
            transaction = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                    base_fee=100
                )
                .append_payment_op(
                    destination=destination,
                    asset=Asset.native(),
                    amount=amount
                )
                .set_timeout(30)
                .build()
            )
            
            # Sign
            transaction.sign(self.secret_key)
            
            # Submit
            response = self.server.submit_transaction(transaction)
            return f"SUCCESS! Hash: {response['hash']}"
        except Exception as e:
            return f"Payment Failed: {str(e)}"

stellar_service = StellarService()
