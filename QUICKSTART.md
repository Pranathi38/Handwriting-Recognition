# Quick Start Guide

## 30-Second Setup

### Step 1: Get API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 2: Create .env File
Create a file named `.env` in the project folder with:
```
GEMINI_API_KEY=paste_your_key_here
```

### Step 3: Install & Run
```bash
pip install -r requirements.txt
python app.py
```

### Step 4: Open Browser
Go to `http://localhost:5000`

## That's It!

1. Upload an image of handwritten text
2. Click "Recognize Text"
3. Watch the process in real-time
4. See your recognized text

## What You'll See

**Frontend:**
- Original image preview
- Status messages showing each step
- Grayscale version of your image
- Final recognized text

**Backend Terminal:**
```
--- Backend Process Started ---
✓ Received image data from frontend
✓ Decoding base64 image data...
✓ Image loaded successfully
✓ Sending request to Google Gemini Pro Vision API...
✓ Response received from Gemini API
--- Backend Process Finished ---
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "GEMINI_API_KEY not found" | Make sure `.env` file exists with your API key |
| "Connection refused" | Run `python app.py` first |
| Image not recognized | Try a clearer image with better handwriting |
| Slow response | First request may take longer (API initialization) |

## Next Steps

- Customize the prompt in `app.py`
- Modify colors in `index.html`
- Deploy to production (see README.md)
