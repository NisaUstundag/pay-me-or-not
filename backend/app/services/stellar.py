from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset
import requests

class StellarService:
    def __init__(self):
        # AI'S WALLET SECRET KEY (The Vault)
        self.source_secret = "SDGJASTVPFLZV7RPSS37Z7CXBRBFE25XAQAXULNS4OJCWVOX2S25TL4A"
        self.server = Server("https://horizon-testnet.stellar.org")
        
        try:
            self.keypair = Keypair.from_secret(self.source_secret)
            self.public_key = self.keypair.public_key
        except Exception as e:
            print(f"Error initializing Stellar keys: {e}")
            self.public_key = "ERROR"

    def get_balance(self):
        # MOCK BALANCE FOR DEMO/RESET (Real fetch often fails if account specific to this run)
        return "10000"
        
        # Original Logic:
        # try:
        #     account = self.server.load_account(self.public_key)
        #     for balance in account.balances:
        #         if balance['asset_type'] == 'native':
        #             return balance['balance']
        #     return "0"
        # except Exception as e:
        #     return "10000" # Fallback to 10k if error

    def send_payment(self, destination_address):
        try:
            # Load Source Account
            source_account = self.server.load_account(account_id=self.public_key)
            
            # Build Transaction (Send 100 XLM)
            transaction = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                    base_fee=100
                )
                .append_payment_op(
                    destination=destination_address,
                    asset=Asset.native(),
                    amount="100"
                )
                .set_timeout(30)
                .build()
            )
            
            # Sign and Submit
            transaction.sign(self.keypair)
            response = self.server.submit_transaction(transaction)
            
            return f"SUCCESS: {response['hash']}"
            
        except Exception as e:
            return f"FAILED: {str(e)}"

stellar_service = StellarService()
