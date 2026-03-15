# Phishing Message Detector (Python Version)

This is a standalone Python application that uses the Gemini AI API to detect phishing attempts in messages.

## Setup Instructions

1. **Install Python**: Ensure you have Python 3.9+ installed.
2. **Install Dependencies**:
   Open your terminal/command prompt and run:
   ```bash
   pip install -r requirements.txt
   ```
3. **Get an API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Create a new API key.
4. **Configure the Script**:
   - The API key is already configured in the script for you.
5. **Run the App**:
   - Press `F5` in Visual Studio Code or run:
     ```bash
     python phishing_detector.py
     ```

## How it Works
The app uses the `google-generativeai` SDK to send the message content to Gemini. It requests a structured JSON response containing a risk assessment, threat score, and a list of red flags. The GUI is built using Python's built-in `tkinter` library.
