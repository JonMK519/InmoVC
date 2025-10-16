import React, { useState } from 'react';
import './Dashboard.css'; // Assuming you will create a CSS file for styles

const mockData = {
  tab1: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ],
  tab2: [
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ],
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('tab1')}>Tab 1</button>
        <button onClick={() => setActiveTab('tab2')}>Tab 2</button>
      </div>
      <div className="content">
        {mockData[activeTab].map(item => (
          <div key={item.id} className={isUnlocked ? 'item' : 'item blurred'}>
            {item.name}
          </div>
        ))}
      </div>
      <div className="watermark">Demo Version</div>
      {!isUnlocked && <button onClick={handleUnlock}>Unlock Features</button>}
    </div>
  );
};

export default Dashboard;