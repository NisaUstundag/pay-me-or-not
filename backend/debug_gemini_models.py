import requests
import json
import os

API_KEY = "AIzaSyDlh2FvvJSvxmD0cei0shGe_Xjv3a4vJCs" 

def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            models = [m['name'].replace('models/', '') for m in data.get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
            
            with open("available_models.json", "w", encoding="utf-8") as f:
                json.dump(models, f, indent=2)
            print("Successfully wrote available_models.json")
        else:
            with open("available_models.json", "w", encoding="utf-8") as f:
                f.write(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    list_models()
