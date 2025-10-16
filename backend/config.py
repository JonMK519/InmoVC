import os
from typing import List

PROJECT_NAME = "InmoVC"
VERSION = "1.0.0"
PROJECT_DESCRIPTION = "API para procesamiento de PDFs inmobiliarios con IA"
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = "50MB"
ALLOWED_EXTENSIONS = {"pdf"}
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173"
]
TESSERACT_CMD = "/usr/bin/tesseract"
LLM_PROVIDER = "openai"
LLM_MODEL = "gpt-4"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # environment variable
