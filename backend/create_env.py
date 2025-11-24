"""
Helper script to create .env file from .env.example
"""
import os
import secrets

def generate_secret_key():
    return secrets.token_urlsafe(32)

def create_env_file():
    if os.path.exists('.env'):
        response = input('.env file already exists. Overwrite? (y/n): ')
        if response.lower() != 'y':
            print('Cancelled.')
            return
    
    # Read .env.example
    if not os.path.exists('.env.example'):
        print('Error: .env.example not found!')
        return
    
    with open('.env.example', 'r') as f:
        content = f.read()
    
    # Replace placeholder values
    content = content.replace('your_secret_key_here', generate_secret_key())
    content = content.replace('your_openai_api_key_here', '')
    
    # Write .env
    with open('.env', 'w') as f:
        f.write(content)
    
    print('.env file created successfully!')
    print('Please edit .env and add:')
    print('  - DATABASE_URL (your PostgreSQL connection string)')
    print('  - OPENAI_API_KEY (your OpenAI API key)')

if __name__ == "__main__":
    create_env_file()


