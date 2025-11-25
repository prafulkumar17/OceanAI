import json
import os

def extract_credentials():
    print("Extracting credentials for Render Deployment...\n")
    
    # 1. Get Client ID & Secret
    client_id = ""
    client_secret = ""
    
    if os.path.exists('oauth_client.json'):
        with open('oauth_client.json', 'r') as f:
            data = json.load(f)
            installed = data.get('installed', {})
            client_id = installed.get('client_id')
            client_secret = installed.get('client_secret')
    elif os.path.exists('backend/oauth_client.json'):
         with open('backend/oauth_client.json', 'r') as f:
            data = json.load(f)
            installed = data.get('installed', {})
            client_id = installed.get('client_id')
            client_secret = installed.get('client_secret')
            
    if not client_id or not client_secret:
        print("Error: Could not find 'oauth_client.json'. Make sure it exists.")
        return

    # 2. Get Refresh Token
    refresh_token = ""
    
    if os.path.exists('token.json'):
        with open('token.json', 'r') as f:
            data = json.load(f)
            refresh_token = data.get('refresh_token')
    elif os.path.exists('backend/token.json'):
        with open('backend/token.json', 'r') as f:
            data = json.load(f)
            refresh_token = data.get('refresh_token')
            
    if not refresh_token:
        print("Error: Could not find 'token.json'. Run 'python setup_google_auth.py' first.")
        return

    print("Credentials Found! Copy these values to Render Environment Variables:\n")
    print("-" * 50)
    print(f"GOOGLE_CLIENT_ID = {client_id}")
    print("-" * 50)
    print(f"GOOGLE_CLIENT_SECRET = {client_secret}")
    print("-" * 50)
    print(f"GOOGLE_REFRESH_TOKEN = {refresh_token}")
    print("-" * 50)

if __name__ == "__main__":
    extract_credentials()
