from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from pathlib import Path
import os
from typing import List, Optional
from pydantic import BaseModel
import json
import time

from config import (
    PROJECT_NAME,
    VERSION,
    PROJECT_DESCRIPTION,
    ALLOWED_ORIGINS,
    UPLOAD_DIR,
    MAX_FILE_SIZE,
    ALLOWED_EXTENSIONS
)

# Create FastAPI app
app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description=PROJECT_DESCRIPTION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

# Pydantic models
class AnalysisResult(BaseModel):
    id: str
    filename: str
    upload_time: str
    status: str
    results: Optional[dict] = None

class ProcessingStatus(BaseModel):
    status: str
    message: str
    progress: int

# In-memory storage (replace with database in production)
analysis_results = {}

@app.get("/")
async def read_root():
    return {
        "message": "Welcome to InmoVC API",
        "version": VERSION,
        "endpoints": {
            "upload": "/api/upload",
            "analyze": "/api/analyze/{file_id}",
            "results": "/api/results/{file_id}",
            "health": "/api/health"
        }
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": VERSION,
        "timestamp": time.time()
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a PDF file for processing"""
    
    # Validate file extension
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Generate unique file ID
    file_id = f"{int(time.time())}_{file.filename}"
    file_path = Path(UPLOAD_DIR) / file_id
    
    # Save file
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Store analysis result metadata
        analysis_results[file_id] = {
            "id": file_id,
            "filename": file.filename,
            "upload_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "uploaded",
            "file_path": str(file_path),
            "results": None
        }
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "status": "uploaded",
            "message": "File uploaded successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.post("/api/analyze/{file_id}")
async def analyze_pdf(file_id: str):
    """Analyze a PDF file with AI"""
    
    if file_id not in analysis_results:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Update status to processing
    analysis_results[file_id]["status"] = "processing"
    
    # Simulate AI processing (replace with actual AI integration)
    # In production, this would call OpenAI/Gemini APIs
    try:
        # Mock analysis results
        mock_results = {
            "advertisements": {
                "title": "Hermoso Apartamento en el Centro",
                "description": "Descubre este maravilloso apartamento de 3 habitaciones ubicado en el corazón de la ciudad. Con acabados modernos y una ubicación privilegiada, es perfecto para familias o profesionales.",
                "highlights": [
                    "3 habitaciones amplias",
                    "2 baños completos",
                    "Cocina equipada",
                    "Balcón con vista panorámica",
                    "Cerca de transporte público"
                ]
            },
            "visual_optimization": {
                "recommendations": [
                    "Mejorar la iluminación en las fotografías",
                    "Incluir más imágenes del exterior",
                    "Agregar un tour virtual 360°",
                    "Destacar los espacios comunes"
                ],
                "image_quality": "Good",
                "suggested_improvements": 4
            },
            "market_analysis": {
                "estimated_price": "$250,000 - $280,000",
                "market_position": "Competitivo",
                "similar_properties": 12,
                "average_days_on_market": 45,
                "price_trends": "Al alza (+5% último trimestre)",
                "neighborhood_score": 8.5
            },
            "extracted_data": {
                "property_type": "Apartamento",
                "bedrooms": 3,
                "bathrooms": 2,
                "area_sqm": 95,
                "price": "$265,000",
                "location": "Centro Ciudad"
            }
        }
        
        # Store results
        analysis_results[file_id]["results"] = mock_results
        analysis_results[file_id]["status"] = "completed"
        
        return {
            "file_id": file_id,
            "status": "completed",
            "message": "Analysis completed successfully",
            "results": mock_results
        }
    
    except Exception as e:
        analysis_results[file_id]["status"] = "failed"
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {str(e)}")

@app.get("/api/results/{file_id}")
async def get_results(file_id: str):
    """Get analysis results for a file"""
    
    if file_id not in analysis_results:
        raise HTTPException(status_code=404, detail="File not found")
    
    return analysis_results[file_id]

@app.get("/api/results")
async def list_results():
    """List all analysis results"""
    return list(analysis_results.values())

@app.delete("/api/results/{file_id}")
async def delete_result(file_id: str):
    """Delete analysis result and file"""
    
    if file_id not in analysis_results:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete file if exists
    file_path = analysis_results[file_id].get("file_path")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)
    
    # Remove from memory
    del analysis_results[file_id]
    
    return {"message": "Result deleted successfully"}

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)