import os
import os.path
import sys
import base64
import io
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Initialize Flask app
app = Flask(__name__, static_folder='.', static_url_path='', template_folder='.')

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env file")
    sys.exit(1)

genai.configure(api_key=GEMINI_API_KEY)

# Serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint for handwriting recognition
@app.route('/api/recognize', methods=['POST'])
def recognize_handwriting():
    print("\n--- OCR Backend Process Started ---")
    
    try:
        # Get the request data
        data = request.get_json()
        if not data or 'image' not in data:
            print("ERROR: No image data received from frontend")
            return jsonify({'error': 'No image data provided'}), 400

        print("✓ Received image data for OCR processing")

        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            # Remove the data URL prefix
            image_data = image_data.split(',')[1]
        
        print("✓ Decoding image for recognition...")
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        print(f"✓ Image loaded successfully (size: {image.size})")

        # Prepare the prompt
        prompt = "Please carefully transcribe all the handwritten text in this image. Return only the transcribed text without any additional commentary or formatting."
        print(f"✓ OCR Prompt prepared: '{prompt}'")

        # Construct payload for Gemini API
        print("✓ Constructing payload for OCR Engine...")
        
        # Send request to Google Gemini API
        print("✓ Sending request to Handwriting Recognition models...")
        
        # Try different models in order of preference
        # Locate your model list
        # UPDATED LIST
        models_to_try = [
            "gemini-2.0-flash",       # Try this first (Fast & Multimodal)
            "gemini-2.5-flash",       # Newer alternative
            "gemini-2.0-pro-exp",     # High reasoning capability
        ]
        model_used = None
        response = None
        
        for model_name in models_to_try:
            try:
                print(f"  Attempting recognition with OCR model: {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content([prompt, image])
                model_used = model_name
                print(f"✓ OCR Model successfully processed request: {model_name}")
                break
            except Exception as e:
                print(f"  ✗ OCR Model {model_name} failed: {str(e)[:100]}")
                continue
        
        if response is None:
            # List available models
            print("\n⚠ No OCR models worked. Available models:")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(f"  - {m.name}")
            raise Exception("No suitable OCR model found. Check available models above.")
        
        print("✓ Recognition results received")

        # Extract the recognized text
        recognized_text = response.text.strip()
        print(f"✓ Extracted text ({len(recognized_text)} characters)")
        print(f"✓ Text preview: {recognized_text[:100]}..." if len(recognized_text) > 100 else f"✓ Text: {recognized_text}")

        # Log final step
        print("--- OCR Process Finished: Sending text to client ---\n")

        # Return clean JSON response
        return jsonify({
            'text': recognized_text,
            'status': 'success'
        })

    except Exception as e:
        print(f"ERROR: {str(e)}")
        print("--- OCR Process Failed ---\n")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("Handwriting Recognition OCR Server")
    print("=" * 60)
    print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")
    print("Starting server on http://localhost:5000")
    print("=" * 60 + "\n")
    
    app.run(debug=True, port=5000)