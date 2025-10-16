import React, { useState, useEffect } from 'react';
import { analyzeFile, getResults } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ fileId, onAnalysisComplete, isUnlocked, onUnlock }) => {
  const [activeTab, setActiveTab] = useState('advertisements');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        setLoading(true);
        // Start analysis
        await analyzeFile(fileId);
        
        // Get results
        const resultsData = await getResults(fileId);
        setResults(resultsData.results);
        onAnalysisComplete(resultsData.results);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error al analizar el archivo');
        setLoading(false);
      }
    };

    startAnalysis();
  }, [fileId, onAnalysisComplete]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <h2>Analizando tu propiedad...</h2>
        <p>Esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'advertisements', label: 'Anuncios y Textos', icon: '📝' },
    { id: 'visual', label: 'Optimización Visual', icon: '🖼️' },
    { id: 'market', label: 'Análisis de Mercado', icon: '📊' },
    { id: 'data', label: 'Datos Extraídos', icon: '📋' },
  ];

  const renderContent = () => {
    if (!results) return null;

    const contentClass = !isUnlocked ? 'content-blurred' : '';

    switch (activeTab) {
      case 'advertisements':
        return (
          <div className={`tab-content ${contentClass}`}>
            <h2>{results.advertisements?.title || 'Título del Anuncio'}</h2>
            <div className="description">
              <h3>Descripción</h3>
              <p>{results.advertisements?.description || 'Descripción de la propiedad...'}</p>
            </div>
            <div className="highlights">
              <h3>Puntos Destacados</h3>
              <ul>
                {(results.advertisements?.highlights || []).map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className={`tab-content ${contentClass}`}>
            <h2>Optimización Visual</h2>
            <div className="visual-info">
              <div className="info-card">
                <h3>Calidad de Imágenes</h3>
                <p className="quality-badge">{results.visual_optimization?.image_quality || 'N/A'}</p>
              </div>
              <div className="info-card">
                <h3>Mejoras Sugeridas</h3>
                <p className="number-badge">{results.visual_optimization?.suggested_improvements || 0}</p>
              </div>
            </div>
            <div className="recommendations">
              <h3>Recomendaciones</h3>
              <ul>
                {(results.visual_optimization?.recommendations || []).map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className={`tab-content ${contentClass}`}>
            <h2>Análisis de Mercado</h2>
            <div className="market-grid">
              <div className="market-card">
                <h3>Precio Estimado</h3>
                <p className="price">{results.market_analysis?.estimated_price || 'N/A'}</p>
              </div>
              <div className="market-card">
                <h3>Posición de Mercado</h3>
                <p>{results.market_analysis?.market_position || 'N/A'}</p>
              </div>
              <div className="market-card">
                <h3>Propiedades Similares</h3>
                <p>{results.market_analysis?.similar_properties || 0}</p>
              </div>
              <div className="market-card">
                <h3>Días Promedio en Mercado</h3>
                <p>{results.market_analysis?.average_days_on_market || 0} días</p>
              </div>
              <div className="market-card">
                <h3>Tendencia de Precios</h3>
                <p>{results.market_analysis?.price_trends || 'N/A'}</p>
              </div>
              <div className="market-card">
                <h3>Puntuación del Vecindario</h3>
                <p className="score">{results.market_analysis?.neighborhood_score || 0}/10</p>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className={`tab-content ${contentClass}`}>
            <h2>Datos Extraídos</h2>
            <div className="data-table">
              <table>
                <tbody>
                  <tr>
                    <td><strong>Tipo de Propiedad</strong></td>
                    <td>{results.extracted_data?.property_type || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Habitaciones</strong></td>
                    <td>{results.extracted_data?.bedrooms || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Baños</strong></td>
                    <td>{results.extracted_data?.bathrooms || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Área (m²)</strong></td>
                    <td>{results.extracted_data?.area_sqm || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Precio</strong></td>
                    <td>{results.extracted_data?.price || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Ubicación</strong></td>
                    <td>{results.extracted_data?.location || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Resultados del Análisis</h1>
        {!isUnlocked && (
          <button className="unlock-button" onClick={onUnlock}>
            🔓 Desbloquear Funciones Completas
          </button>
        )}
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
