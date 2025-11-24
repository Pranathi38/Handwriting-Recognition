// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imageContainer = document.querySelector('.image-container');
const statusMessage = document.getElementById('statusMessage');
const spinner = document.getElementById('spinner');
const recognizeBtn = document.getElementById('recognizeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultArea = document.getElementById('resultArea');
const grayscaleContainer = document.getElementById('grayscaleContainer');
const grayscalePlaceholder = document.getElementById('grayscalePlaceholder');
const grayscaleImage = document.getElementById('grayscaleImage');
const downloadBtn = document.getElementById('downloadBtn');

// State
let selectedFile = null;
let originalImage = null;
let currentGrayscaleFilename = null;

// Upload Area Click Handler
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// Drag and Drop Handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f0f2ff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '#f8f9ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f9ff';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// File Input Change Handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Handle File Selection
function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        statusMessage.textContent = 'Please select a valid image file.';
        return;
    }

    selectedFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            displayImage(img);
            uploadArea.classList.add('has-file');
            recognizeBtn.disabled = false;
            statusMessage.textContent = 'Image loaded. Ready to process.';
            resultArea.classList.add('empty');
            resultArea.textContent = 'No text recognized yet';
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Display Image in Container
function displayImage(img) {
    imageContainer.innerHTML = '';
    const displayImg = new Image();
    displayImg.src = img.src;
    imageContainer.appendChild(displayImg);
}

// Convert Image to Grayscale
function convertToGrayscale(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Show Spinner
function showSpinner() {
    spinner.classList.remove('hidden');
}

// Hide Spinner
function hideSpinner() {
    spinner.classList.add('hidden');
}

// Recognize Button Click Handler
recognizeBtn.addEventListener('click', async () => {
    if (!originalImage) return;

    try {
        // Step 1: Create grayscale version for display
        statusMessage.textContent = 'Step 1: Creating grayscale version locally...';
        const grayscaleCanvas = convertToGrayscale(originalImage);
        
        // Display grayscale image on screen
        imageContainer.innerHTML = '';
        imageContainer.appendChild(grayscaleCanvas);

        // Step 2: Send original image to backend
        statusMessage.textContent = 'Step 2: Sending to secure backend engine...';
        showSpinner();

        // Convert original image to base64 (not the grayscale canvas)
        const base64Image = originalImage.src;

        // Send to backend
        const response = await fetch('/api/recognize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image
            })
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();

        // Step 3: Display result
        hideSpinner();
        statusMessage.textContent = 'Process Complete.';
        
        // Display grayscale image from backend
        if (data.grayscale_image) {
            currentGrayscaleFilename = data.grayscale_filename;
            grayscaleImage.src = `data:image/png;base64,${data.grayscale_image}`;
            grayscaleContainer.classList.remove('hidden');
            grayscalePlaceholder.classList.add('hidden');
        }
        
        resultArea.classList.remove('empty');
        resultArea.textContent = data.text || 'No text could be recognized.';

    } catch (error) {
        hideSpinner();
        statusMessage.textContent = 'Error during processing. Please try again.';
        console.error('Recognition error:', error);
        resultArea.classList.remove('empty');
        resultArea.textContent = `Error: ${error.message}`;
    }
});

// Download Button Click Handler
downloadBtn.addEventListener('click', () => {
    if (!currentGrayscaleFilename) return;
    
    const downloadUrl = `/api/download-grayscale/${currentGrayscaleFilename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = currentGrayscaleFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Clear Button Click Handler
clearBtn.addEventListener('click', () => {
    selectedFile = null;
    originalImage = null;
    currentGrayscaleFilename = null;
    fileInput.value = '';
    uploadArea.classList.remove('has-file');
    recognizeBtn.disabled = true;
    hideSpinner();
    statusMessage.textContent = 'Ready to process';
    resultArea.classList.add('empty');
    resultArea.textContent = 'No text recognized yet';
    grayscaleContainer.classList.add('hidden');
    grayscalePlaceholder.classList.remove('hidden');
    imageContainer.innerHTML = '<div class="image-placeholder">No image selected</div>';
});
