from fastapi import FastAPI, UploadFile, File
import PyPDF2
import pytesseract
from pdf2image import convert_from_path
import requests
import json
import os
from pydantic import BaseModel

app = FastAPI()

class AnalysisRequest(BaseModel):
    text: str

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    pdf_file = await file.read()
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    
    for page in reader.pages:
        text += page.extract_text() or ""
    
    # Fallback for scanned PDFs
    if not text.strip():
        images = convert_from_path(file.filename)
        for img in images:
            text += pytesseract.image_to_string(img)

    return {"extracted_text": text}

@app.post("/generate-analysis")
async def generate_analysis(request: AnalysisRequest):
    # Placeholder for LLM API call
    gpt4_api_url = "https://api.openai.com/v1/chat/completions"  # Example URL
    headers = {"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"}
    
    response = requests.post(gpt4_api_url, headers=headers, json={
        "model": "gpt-4",
        "messages": [{"role": "user", "content": request.text}],
    })
    
    structured_content = response.json()
    return structured_content
