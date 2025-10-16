import React, { useState } from 'react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Anúncios e Textos');

  const data = {
    'Anúncios e Textos': [
      { id: 1, title: 'Anúncio 1', content: 'Texto do anúncio 1' },
      { id: 2, title: 'Anúncio 2', content: 'Texto do anúncio 2' },
    ],
    'Otimização Visual': [
      { id: 1, title: 'Visual 1', content: 'Detalhes sobre otimização visual 1' },
      { id: 2, title: 'Visual 2', content: 'Detalhes sobre otimização visual 2' },
    ],
    'Análise de Mercado': [
      { id: 1, title: 'Análise 1', content: 'Dados da análise de mercado 1' },
      { id: 2, title: 'Análise 2', content: 'Dados da análise de mercado 2' },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Resultados da Análise</h1>
      <div>
        {['Anúncios e Textos', 'Otimização Visual', 'Análise de Mercado'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: activeTab === tab ? '#007bff' : '#f1f1f1',
              color: activeTab === tab ? '#fff' : '#000',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        {data[activeTab].map(item => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;