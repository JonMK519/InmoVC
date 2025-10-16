# InmoVC - AI-Powered Real Estate Analysis Platform

InmoVC is an intelligent platform that uses AI to analyze real estate PDF documents, generating professional advertisements, visual optimization recommendations, and comprehensive market analysis.

## 🚀 Features

- **📄 PDF Upload & Processing**: Upload real estate PDFs for automated analysis
- **🤖 AI-Powered Analysis**: Automatic extraction and analysis using OpenAI/Gemini
- **📝 Advertisement Generation**: Create professional property listings automatically
- **🖼️ Visual Optimization**: Get recommendations for improving property photos
- **📊 Market Analysis**: Comprehensive market data and pricing insights
- **🔓 Demo/Pro Features**: Freemium model with unlock functionality

## 🏗️ Architecture

### Backend (FastAPI)
- RESTful API with FastAPI
- PDF processing and OCR
- AI integration (OpenAI/Gemini)
- File upload management
- CORS configuration

### Frontend (React + Vite)
- Modern React with hooks
- File upload with drag & drop
- Tabbed dashboard interface
- Modal for unlock features
- Responsive design

## 📦 Project Structure

```
InmoVC/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Modal.jsx
│   │   ├── services/        # API integration
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (optional):
```bash
# For AI features (optional)
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

5. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🚀 Usage

1. **Start the Backend**: Run the FastAPI server on port 8000
2. **Start the Frontend**: Run the Vite dev server on port 3000
3. **Upload a PDF**: Drag & drop or select a real estate PDF
4. **View Analysis**: See results in different tabs:
   - Advertisements & Texts
   - Visual Optimization
   - Market Analysis
   - Extracted Data
5. **Unlock Features**: Click "Unlock" for full access (demo)

## 📡 API Endpoints

### Core Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/upload` - Upload PDF file
- `POST /api/analyze/{file_id}` - Analyze uploaded file
- `GET /api/results/{file_id}` - Get analysis results
- `GET /api/results` - List all results
- `DELETE /api/results/{file_id}` - Delete result

### Example API Usage

```bash
# Upload a file
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@property.pdf"

# Analyze the file
curl -X POST "http://localhost:8000/api/analyze/{file_id}"

# Get results
curl "http://localhost:8000/api/results/{file_id}"
```

## 🎨 Frontend Components

### FileUpload
- Drag & drop file upload
- File validation
- Progress indication
- Feature highlights

### Dashboard
- Tabbed interface
- Real-time analysis display
- Content blur for demo mode
- Unlock button

### Modal
- Benefits showcase
- Email collection
- Pricing information
- Demo unlock functionality

## 🔧 Configuration

### Backend Configuration (config.py)
```python
PROJECT_NAME = "InmoVC"
VERSION = "1.0.0"
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = "50MB"
ALLOWED_EXTENSIONS = {"pdf"}
ALLOWED_ORIGINS = ["http://localhost:3000"]
```

### Frontend Configuration (vite.config.js)
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

## 🧪 Development

### Backend Development
```bash
cd backend
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
# AI API Keys (Optional - for full AI features)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Application Settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50MB
```

## 🐳 Docker (Optional)

Coming soon: Docker and Docker Compose configurations for easy deployment.

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a demo project. For production use, consider:
- Adding proper database (PostgreSQL, MongoDB)
- Implementing real AI integrations
- Adding authentication & authorization
- Implementing payment processing
- Adding comprehensive error handling
- Writing unit and integration tests
- Setting up CI/CD pipelines

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Made with ❤️ for the real estate industry
