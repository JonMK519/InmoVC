import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [fileId, setFileId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleFileUploaded = (id) => {
    setFileId(id);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handleUnlock = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    setShowModal(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>InmoVC</h1>
        <p className="subtitle">Análisis Inmobiliario con Inteligencia Artificial</p>
      </header>

      <main className="app-main">
        {!fileId ? (
          <FileUpload onFileUploaded={handleFileUploaded} />
        ) : (
          <Dashboard
            fileId={fileId}
            onAnalysisComplete={handleAnalysisComplete}
            isUnlocked={isUnlocked}
            onUnlock={handleUnlock}
          />
        )}
      </main>

      {!isUnlocked && (
        <div className="watermark">Versión Demo</div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        onUnlockSuccess={handleUnlockSuccess}
      />

      <footer className="app-footer">
        <p>© 2024 InmoVC - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default App;
