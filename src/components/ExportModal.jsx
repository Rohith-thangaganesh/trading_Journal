import React, { useState } from 'react';
import { X, Download, Calendar } from 'lucide-react';
import { getTrades } from '../utils/storage';

const ExportModal = ({ isOpen, onClose }) => {
    const [market, setMarket] = useState('All');
    const [timeframe, setTimeframe] = useState('Total');

    if (!isOpen) return null;

    const handleExport = () => {
        const trades = getTrades();
        let filteredTrades = [...trades];

        // Filter by Market
        if (market !== 'All') {
            filteredTrades = filteredTrades.filter(t => t.market === market);
        }

        // Filter by Timeframe
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        if (timeframe === 'Weekly') {
            filteredTrades = filteredTrades.filter(t => new Date(t.date) >= startOfWeek);
        } else if (timeframe === 'Monthly') {
            filteredTrades = filteredTrades.filter(t => new Date(t.date) >= startOfMonth);
        } else if (timeframe === 'Quarterly') {
            filteredTrades = filteredTrades.filter(t => new Date(t.date) >= startOfQuarter);
        } else if (timeframe === 'Yearly') {
            filteredTrades = filteredTrades.filter(t => new Date(t.date) >= startOfYear);
        }

        if (filteredTrades.length === 0) {
            alert('No trades found for the selected criteria.');
            return;
        }

        const headers = ['Date', 'Time', 'Market', 'Session', 'Script', 'Type', 'Entry', 'Exit', 'SL', 'TP', 'Qty', 'PnL', 'Status', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...filteredTrades.map(t => [
                t.date, t.time, t.market, t.session || '', t.script, t.type,
                t.entryPrice, t.exitPrice, t.stopLoss, t.takeProfit, t.quantity,
                t.pnl, t.status, `"${t.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `trading_journal_${market}_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Download className="mr-2 text-blue-600" size={24} />
                    Export Trades
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market</label>
                        <select
                            value={market}
                            onChange={(e) => setMarket(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="All">All Markets</option>
                            <option value="Indian">Indian Market</option>
                            <option value="Forex">Forex Market</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeframe</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Total'].map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${timeframe === tf
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                                            : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
