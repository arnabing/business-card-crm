from flask import Flask, request, render_template, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import requests
import base64
import os

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Load OpenAI API key from environment or config
# client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
openai_api_key = os.getenv('OPENAI_API_KEY')


@app.route('/', methods=['GET'])
def index():
    # Render the main page. This serves the HTML file where users can upload images.
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']

    # Read the file into bytes and encode it to base64
    base64_image = base64.b64encode(file.read()).decode('utf-8')

    # Create the headers for the OpenAI API request
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }

    # Create the payload with the base64-encoded image
    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "This is a business card image. Extract the data and put it in JSON format: { 'Name': 'John Doe', 'Title': 'Software Engineer', 'Phone': '123-456-7890', 'Email': 'john.doe@example.com', 'Company': 'Google' }, convert this data into an HTML table.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    # Send the request to the OpenAI API
    response = requests.post(
        "https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    # Check the response status and return the appropriate result or error
    if response.status_code == 200:
        structured_data = response.json()
        return jsonify(structured_data), 200

    else:
        # Log the error response from OpenAI API
        print(f"Error in OpenAI API response: {
            response.status_code} - {response.text}")
        return jsonify({"error": "Error processing the image with OpenAI API"}), response.status_code


app.debug = True
# Start the Flask app. Debug mode is on for development purposes.
# Turn off debug mode when deploying to production for security reasons.
if __name__ == '__main__':
    app.run(debug=True)
