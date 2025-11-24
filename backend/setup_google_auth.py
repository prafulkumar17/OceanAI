import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# If modifying these scopes, delete the file token.json.
SCOPES = [
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/drive'
]

def setup_auth():
    """Shows basic usage of the Slides API.
    Prints the number of slides and other counts.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Error refreshing token: {e}")
                creds = None
                
        if not creds:
            if not os.path.exists('oauth_client.json'):
                print("❌ Error: 'oauth_client.json' not found!")
                print("Please download your OAuth 2.0 Client ID JSON from Google Cloud Console")
                print("and save it as 'oauth_client.json' in this directory.")
                return

            flow = InstalledAppFlow.from_client_secrets_file(
                'oauth_client.json', SCOPES)
            creds = flow.run_local_server(port=0)
            
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            print("✅ Success! 'token.json' has been created.")

if __name__ == '__main__':
    setup_auth()
