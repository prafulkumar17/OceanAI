from __future__ import print_function
import os.path
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Google Slides + Drive scopes
SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/presentations'
]

def main():
    creds = None
    
    # Tokens will be saved here
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    # Force authentication if no token or token invalid/expired
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print("\nOpening browser for Google Login...")
            flow = InstalledAppFlow.from_client_secrets_file(
                'oauth_client.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the obtained token
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    print("\nSUCCESS! token.json has been generated.")
    print("You can now use Slides API from your backend.")

if __name__ == '__main__':
    main()
