import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, selecciona un archivo PDF');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await uploadFile(file);
      onFileUploaded(response.file_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Sube tu PDF Inmobiliario</h2>
      <p className="upload-description">
        Sube un PDF de una propiedad para obtener análisis automático con IA
      </p>

      <form 
        className={`upload-form ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file-input" className="file-label">
          <div className="upload-icon">📄</div>
          <p>
            {file 
              ? `Archivo seleccionado: ${file.name}`
              : 'Arrastra un archivo PDF aquí o haz clic para seleccionar'
            }
          </p>
        </label>

        {error && <div className="error-message">{error}</div>}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? 'Subiendo...' : 'Subir y Analizar'}
        </button>
      </form>

      <div className="features-info">
        <h3>Características del análisis:</h3>
        <ul>
          <li>✓ Generación automática de anuncios y textos</li>
          <li>✓ Optimización visual de fotografías</li>
          <li>✓ Análisis de mercado inmobiliario</li>
          <li>✓ Extracción de datos de la propiedad</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
