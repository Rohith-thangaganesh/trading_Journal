import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { deleteTrade } from '../utils/storage';

const TradesTable = ({ trades, onTradeDeleted }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const filteredTrades = useMemo(() => {
        let result = [...trades];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.script.toLowerCase().includes(lowerTerm) ||
                t.notes.toLowerCase().includes(lowerTerm)
            );
        }

        if (filterDate) {
            result = result.filter(t => t.date === filterDate);
        }

        if (filterType !== 'All') {
            result = result.filter(t => t.type === filterType);
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [trades, searchTerm, filterDate, filterType, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this trade?')) {
            deleteTrade(id);
            onTradeDeleted();
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <div className="w-4 h-4 inline-block" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline" /> : <ArrowDown size={14} className="inline" />;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search script or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="All">All Types</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {['Date', 'Time', 'Session', 'Script', 'Type', 'Entry', 'Exit', 'Qty', 'P&L', 'Status', 'Actions'].map((header, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => header !== 'Actions' && requestSort(header.toLowerCase().replace('&', 'n').replace(' ', ''))}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${header === 'Actions' ? 'cursor-default' : ''}`}
                                >
                                    {header} <SortIcon column={header.toLowerCase().replace('&', 'n').replace(' ', '')} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTrades.length > 0 ? (
                            filteredTrades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{trade.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.session || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{trade.script}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trade.type === 'Buy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                            }`}>
                                            {trade.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.entryPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.exitPrice || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{trade.quantity}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${trade.pnl > 0 ? 'text-green-600 dark:text-green-400' : trade.pnl < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                                        }`}>
                                        {trade.pnl !== 0 ? (trade.pnl > 0 ? '+' + trade.pnl : trade.pnl) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trade.status === 'Win' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                trade.status === 'Loss' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                            }`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <button
                                            onClick={() => handleDelete(trade.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    No trades found. Start journaling!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TradesTable;
