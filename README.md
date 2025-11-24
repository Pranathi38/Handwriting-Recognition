# Handwriting Recognition Web Application

A clean, self-contained web application for recognizing handwritten text from images using Google Gemini Pro Vision API.

## Features

✨ **Clean, Custom UI** - No external API indicators or logos  
🔒 **Secure Backend** - API key never exposed to frontend  
👁️ **Process Visibility** - See each step of the recognition process  
📊 **Detailed Logging** - Backend logs show every step in the terminal  
🎨 **Modern Design** - Beautiful gradient UI with smooth animations  
📱 **Responsive** - Works on desktop and mobile devices  

## Architecture

```
Frontend (Vanilla HTML/CSS/JS)
    ↓
    ├─ Image Upload & Preview
    ├─ Grayscale Conversion (Canvas API)
    ├─ Status Messages & Spinner
    └─ Result Display
    
    ↓ (Secure HTTPS/HTTP)
    
Backend (Python Flask)
    ├─ Receives base64 image
    ├─ Logs each step to terminal
    ├─ Calls Gemini API (API key secure)
    └─ Returns clean text response
```

## Prerequisites

- Python 3.8 or higher
- Google Gemini API key (free tier available)
- Modern web browser

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## Usage

1. **Upload Image**: Click the upload area or drag & drop an image of handwritten text
2. **Preview**: See your original image in the preview area
3. **Recognize**: Click "Recognize Text" button
4. **Watch Process**: 
   - See status: "Step 1: Creating grayscale version locally..."
   - Image converts to grayscale on screen
   - See status: "Step 2: Sending to secure backend engine..."
   - Loading spinner appears
5. **View Result**: Recognized text appears in the result area
6. **Clear**: Click "Clear All" to start over

## Backend Process Flow (Terminal Logs)

When you click "Recognize Text", you'll see detailed logs in the terminal:

```
--- Backend Process Started ---
✓ Received image data from frontend
✓ Decoding base64 image data...
✓ Image loaded successfully (size: 1200x800)
✓ Prompt prepared: 'Please carefully transcribe...'
✓ Constructing payload for Gemini API...
✓ Sending request to Google Gemini Pro Vision API...
✓ Response received from Gemini API
✓ Extracted text (245 characters)
✓ Text preview: The quick brown fox jumps...
--- Backend Process Finished: Sending cleaned text back to client ---
```

## File Structure

```
HR1/
├── index.html          # Main HTML page with UI
├── script.js           # Frontend JavaScript (image handling, API calls)
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── .env                # Your actual API key (create from .env.example)
└── README.md           # This file
```

## Security Features

🔐 **API Key Protection**
- Gemini API key stored only on backend server
- Never exposed to browser or network requests
- Loaded from `.env` file (not in version control)

🔒 **No Data Exposure**
- No raw JSON dumps shown to user
- No API response details visible
- Clean, user-friendly text output only

## Customization

### Change the Prompt

Edit the prompt in `app.py` (line ~65):
```python
prompt = "Your custom prompt here..."
```

### Modify UI Colors

Edit the gradient colors in `index.html` (line ~20):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Image Size Limits

Modify the file input in `index.html` or add validation in `script.js`

## Troubleshooting

### "GEMINI_API_KEY not found"
- Ensure `.env` file exists in the same directory as `app.py`
- Verify the API key is correctly pasted in `.env`
- Restart the server after changing `.env`

### "Connection refused" on localhost:5000
- Ensure Flask server is running (`python app.py`)
- Check if port 5000 is available
- Try a different port by modifying `app.py` (last line)

### Image not converting to grayscale
- Check browser console for JavaScript errors
- Ensure image format is supported (PNG, JPG, GIF)
- Try a different image file

### Gemini API returns error
- Verify API key is valid and has quota remaining
- Check internet connection
- Ensure image is clear and readable
- Try with a different handwritten text image

## Performance Notes

- Images are processed locally in the browser before sending
- Grayscale conversion happens client-side (no server overhead)
- Backend only handles Gemini API communication
- Typical recognition time: 2-5 seconds depending on image complexity

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend terminal logs for detailed error messages
3. Verify your Gemini API key is valid
4. Check browser console (F12) for frontend errors
