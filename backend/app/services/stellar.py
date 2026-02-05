from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset
import requests

# AI'S WALLET SECRET KEY (The Vault)
SOURCE_SECRET = "SDGJASTVPFLZV7RPSS37Z7CXBRBFE25XAQAXULNS4OJCWVOX2S25TL4A"

def send_payment(destination_address):
    try:
        # Connect to Stellar Testnet
        server = Server("https://horizon-testnet.stellar.org")
        source_keypair = Keypair.from_secret(SOURCE_SECRET)
        
        # Load Source Account
        source_account = server.load_account(account_id=source_keypair.public_key)
        
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
        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)
        
        return {"status": "success", "hash": response["hash"]}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
