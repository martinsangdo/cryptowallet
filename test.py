import json, hmac, hashlib, time, requests
from requests.auth import AuthBase

# Before implementation, set environmental variables with the names API_KEY and API_SECRET
API_KEY = '0zGLoccZQkdc8ViE'
API_SECRET = 'xOzMvwhjmhVxq9UAdhCnMq29vUsf8FvC'

# Create custom authentication for Coinbase API
class CoinbaseWalletAuth(AuthBase):
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def __call__(self, request):
        timestamp = str(int(time.time()))
        message = timestamp + request.method + request.path_url + (request.body or '')
        signature = hmac.new(self.secret_key, message, hashlib.sha256).hexdigest()

        request.headers.update({
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-ACCESS-KEY': self.api_key,
            'CB-VERSION': '2018-06-02'
        })
        return request

api_url = 'https://api.coinbase.com/v2/'
auth = CoinbaseWalletAuth(API_KEY, API_SECRET)

# Get current user
r = requests.get(api_url + 'user', auth=auth)
print r.json()
