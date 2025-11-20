import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'trading_journal_data';
const MARKET_PREF_KEY = 'trading_journal_market_pref';

export const getTrades = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveTrade = (trade) => {
    const trades = getTrades();
    const newTrade = { ...trade, id: uuidv4() };
    const updatedTrades = [newTrade, ...trades];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
    return newTrade;
};

export const deleteTrade = (id) => {
    const trades = getTrades();
    const updatedTrades = trades.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
    return updatedTrades;
};

export const getMarketPreference = () => {
    return localStorage.getItem(MARKET_PREF_KEY);
};

export const setMarketPreference = (market) => {
    localStorage.setItem(MARKET_PREF_KEY, market);
};

export const exportToCSV = () => {
    const trades = getTrades();
    if (trades.length === 0) return;

    const headers = ['Date', 'Time', 'Market', 'Session', 'Script', 'Type', 'Entry', 'Exit', 'SL', 'TP', 'Qty', 'PnL', 'Status', 'Notes'];
    const csvContent = [
        headers.join(','),
        ...trades.map(t => [
            t.date, t.time, t.market, t.session || '', t.script, t.type,
            t.entryPrice, t.exitPrice, t.stopLoss, t.takeProfit, t.quantity,
            t.pnl, t.status, `"${t.notes || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trading_journal_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
