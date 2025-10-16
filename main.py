from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import PyPDF2
import pytesseract
from fastapi.responses import JSONResponse

app = FastAPI()

class PDFRequest(BaseModel):
    pdf_path: str

class AnalysisRequest(BaseModel):
    prompt: str

@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "healthy"})

@app.post("/process-pdf")
async def process_pdf(request: PDFRequest):
    try:
        # Read PDF file
        with open(request.pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            if not text:
                # Fallback to OCR
                text = pytesseract.image_to_string(request.pdf_path)
        return JSONResponse(content={"extracted_text": text.strip()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-analysis")
async def generate_analysis(request: AnalysisRequest):
    # Placeholder for LLM analysis logic
    # In a real implementation, this should call your LLM service and return structured JSON
    analysis_result = {
        "input_prompt": request.prompt,
        "generated_content": "This is a placeholder for generated marketing content."
    }
    return JSONResponse(content=analysis_result)