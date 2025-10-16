from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import PyPDF2
import pytesseract
from pdf2image import convert_from_bytes
import requests
import json
import os
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import io

app = FastAPI(title="InmoVC PDF Processor", version="1.0.0")

# ==================== MODELS ====================

class PDFProcessRequest(BaseModel):
    """Modelo para recibir el texto extraído del PDF"""
    extracted_text: str
    filename: Optional[str] = None

class AnalysisResponse(BaseModel):
    """Modelo de respuesta del análisis generado por LLM"""
    announcement_title: str
    long_description_pt: str
    long_description_en: str
    instagram_post: str
    key_features: list
    target_audience: str
    call_to_action: str

# ==================== ENDPOINTS ====================

@app.get("/health")
async def health_check():
    """Endpoint para verificar que la API está funcionando"""
    return JSONResponse({
        "status": "healthy",
        "service": "InmoVC PDF Processor",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "name": "InmoVC PDF Processor API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "process_pdf": "POST /process-pdf (upload PDF file)",
            "generate_analysis": "POST /generate-analysis (send extracted text)"
        },
        "documentation": "/docs"
    }

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    """
    Endpoint para procesar archivos PDF.
    Extrae texto usando PyPDF2 y OCR (pytesseract) como plan B.
    """
    try:
        file_content = await file.read()
        extracted_text = ""
        extraction_method = "unknown"
        
        # PLAN A: PyPDF2
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            extracted_text = ""
            
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() or ""
            
            if len(extracted_text.strip()) > 50:
                extraction_method = "PyPDF2"
                return JSONResponse({
                    "status": "success",
                    "filename": file.filename,
                    "extraction_method": extraction_method,
                    "extracted_text": extracted_text,
                    "character_count": len(extracted_text),
                    "timestamp": datetime.utcnow().isoformat()
                })
        except Exception as e:
            print(f"Error con PyPDF2: {str(e)}")
        
        # PLAN B: OCR
        if not extracted_text or len(extracted_text.strip()) <= 50:
            try:
                images = convert_from_bytes(file_content)
                extracted_text = ""
                
                for img in images:
                    ocr_text = pytesseract.image_to_string(img)
                    extracted_text += ocr_text + "\n---\n"
                
                extraction_method = "OCR (pytesseract)"
                
            except ImportError:
                raise HTTPException(
                    status_code=400,
                    detail="pdf2image no está instalado"
                )
        
        if not extracted_text or len(extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No se pudo extraer texto del PDF")
        
        return JSONResponse({
            "status": "success",
            "filename": file.filename,
            "extraction_method": extraction_method,
            "extracted_text": extracted_text,
            "character_count": len(extracted_text),
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error procesando archivo: {str(e)}")

@app.post("/generate-analysis")
async def generate_analysis(request: PDFProcessRequest):
    """
    Endpoint para generar análisis de marketing usando LLM.
    """
    try:
        if not request.extracted_text or len(request.extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="El texto extraído no puede estar vacío")
        
        llm_api_key = os.getenv("LLM_API_KEY")
        if not llm_api_key:
            raise HTTPException(status_code=400, detail="LLM_API_KEY no configurada")
        
        analysis = await generate_llm_analysis(request.extracted_text, llm_api_key)
        
        return JSONResponse({
            "status": "success",
            "filename": request.filename,
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generando análisis: {str(e)}")

# ==================== LLM LOGIC ====================

async def generate_llm_analysis(extracted_text: str, api_key: str) -> dict:
    """Función para llamar al LLM (GPT-4 o Gemini)"""
    
    system_prompt = """Eres un experto en marketing inmobiliario. Analiza el texto del PDF y genera contenido de marketing.

INSTRUCCIONES:
1. Título corto, impactante y orientado a SEO (máx 60 caracteres)
2. Descripción larga en PORTUGUÉS (mín 500 caracteres)
3. Descripción en INGLÉS (mín 500 caracteres)
4. Post de INSTAGRAM (máx 300 caracteres) con hashtags y emojis
5. 5-7 características principales
6. Público objetivo
7. Call-to-action profesional

RESPUESTA: ÚNICAMENTE JSON válido
{
    "announcement_title": "Título",
    "long_description_pt": "Descripción PT...",
    "long_description_en": "Description EN...",
    "instagram_post": "Post Instagram...",
    "key_features": ["Feature 1", "Feature 2"],
    "target_audience": "Audiencia objetivo",
    "call_to_action": "CTA"
}"""

    user_message = f"""Analiza este texto y genera marketing content en JSON:

{extracted_text}

RESPONDE SOLO CON JSON VÁLIDO."""

    try:
        response = await call_openai_api(api_key, system_prompt, user_message)
        if response:
            return response
        
        response = await call_gemini_api(api_key, system_prompt, user_message)
        return response
        
    except Exception as e:
        raise Exception(f"Error calling LLM API: {str(e)}")

async def call_openai_api(api_key: str, system_prompt: str, user_message: str) -> dict:
    """Llamada a OpenAI API (GPT-4)"""
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            analysis = json.loads(content)
            return analysis
        else:
            print(f"OpenAI API error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"OpenAI API call failed: {str(e)}")
        return None

async def call_gemini_api(api_key: str, system_prompt: str, user_message: str) -> dict:
    """Llamada a Google Gemini API"""
    try:
        headers = {"Content-Type": "application/json"}
        
        payload = {
            "contents": [{"parts": [{"text": system_prompt + "\n\n" + user_message}]}]
        }
        
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            content = result["candidates"][0]["content"]["parts"][0]["text"]
            analysis = json.loads(content)
            return analysis
        else:
            print(f"Gemini API error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Gemini API call failed: {str(e)}")
        return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)