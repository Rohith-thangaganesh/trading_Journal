import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import TradeForm from './components/TradeForm';
import TradesTable from './components/TradesTable';
import Dashboard from './components/Dashboard';
import { getMarketPreference, setMarketPreference, getTrades, exportToCSV } from './utils/storage';

function App() {
  const [market, setMarket] = useState(null);
  const [activeTab, setActiveTab] = useState('journal');
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data
    const savedMarket = getMarketPreference();
    if (savedMarket) {
      setMarket(savedMarket);
    }
    loadTrades();
    setLoading(false);
  }, []);

  const loadTrades = () => {
    setTrades(getTrades());
  };

  const handleMarketSelect = (selectedMarket) => {
    setMarketPreference(selectedMarket);
    setMarket(selectedMarket);
  };

  const handleTradeAdded = () => {
    loadTrades();
  };

  const handleTradeDeleted = () => {
    loadTrades();
  };

  // Expose export function to window for Layout to access (or pass as prop if I refactored Layout)
  // Since I used window.exportData in the previous step's thought but didn't implement it fully in the Replace call (I put a placeholder),
  // I should actually pass it as a prop to Layout. 
  // Wait, I modified Layout to call `window.exportData`. I should probably fix that to be a prop.
  // Let's fix Layout first or just attach it to window. Attaching to window is hacky.
  // I'll pass `onExport` to Layout.

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;

  if (!market) {
    return <WelcomeScreen onSelectMarket={handleMarketSelect} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onExport={exportToCSV}
      currentMarket={market}
      onMarketChange={handleMarketSelect}
    >
      {activeTab === 'journal' ? (
        <div className="space-y-8 animate-fade-in">
          <TradeForm market={market} onTradeAdded={handleTradeAdded} />
          <TradesTable trades={trades} onTradeDeleted={handleTradeDeleted} />
        </div>
      ) : (
        <div className="animate-fade-in">
          <Dashboard trades={trades} />
        </div>
      )}
    </Layout>
  );
}

export default App;
