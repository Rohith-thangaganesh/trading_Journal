import React, { useState, useEffect } from 'react';
import { Save, Calculator } from 'lucide-react';
import { saveTrade } from '../utils/storage';

const TradeForm = ({ market, onTradeAdded }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        market: market,
        session: '',
        script: '',
        type: 'Buy',
        entryPrice: '',
        exitPrice: '',
        stopLoss: '',
        takeProfit: '',
        quantity: '',
        notes: ''
    });

    const [calculations, setCalculations] = useState({
        pnl: 0,
        rrRatio: 0,
        status: 'Pending'
    });

    useEffect(() => {
        calculateMetrics();
    }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.type, formData.stopLoss, formData.takeProfit]);

    const calculateMetrics = () => {
        const entry = parseFloat(formData.entryPrice) || 0;
        const exit = parseFloat(formData.exitPrice) || 0;
        const qty = parseFloat(formData.quantity) || 0;
        const sl = parseFloat(formData.stopLoss) || 0;
        const tp = parseFloat(formData.takeProfit) || 0;

        if (entry === 0) return;

        let pnl = 0;
        if (exit > 0) {
            pnl = (formData.type === 'Buy' ? exit - entry : entry - exit) * qty;
        }

        let rr = 0;
        if (sl > 0 && tp > 0) {
            const risk = Math.abs(entry - sl);
            const reward = Math.abs(tp - entry);
            if (risk > 0) {
                rr = reward / risk;
            }
        }

        let status = 'Pending';
        if (exit > 0) {
            status = pnl > 0 ? 'Win' : pnl < 0 ? 'Loss' : 'BreakEven';
        }

        setCalculations({
            pnl: parseFloat(pnl.toFixed(2)),
            rrRatio: parseFloat(rr.toFixed(2)),
            status
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trade = {
            ...formData,
            ...calculations,
            entryPrice: parseFloat(formData.entryPrice),
            exitPrice: parseFloat(formData.exitPrice) || 0,
            stopLoss: parseFloat(formData.stopLoss) || 0,
            takeProfit: parseFloat(formData.takeProfit) || 0,
            quantity: parseFloat(formData.quantity)
        };

        saveTrade(trade);
        onTradeAdded();

        // Reset form but keep date/market
        setFormData(prev => ({
            ...prev,
            session: '',
            script: '',
            entryPrice: '',
            exitPrice: '',
            stopLoss: '',
            takeProfit: '',
            quantity: '',
            notes: ''
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-blue-500" />
                New Trade Entry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                        <input
                            type="time"
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market</label>
                        <input
                            type="text"
                            name="market"
                            readOnly
                            value={formData.market}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-sm"
                        />
                    </div>

                    {/* Session Dropdown - Conditional */}
                    {formData.market === 'Forex' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session</label>
                            <select
                                name="session"
                                value={formData.session}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select Session</option>
                                <option value="Tokyo">Tokyo (Asian)</option>
                                <option value="London">London (European)</option>
                                <option value="New York">New York (North American)</option>
                                <option value="Australia">Australia (Pacific)</option>
                            </select>
                        </div>
                    )}

                    {formData.market === 'Indian' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session</label>
                            <select
                                name="session"
                                value={formData.session}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select Session</option>
                                <option value="Morning">Morning Session</option>
                                <option value="Afternoon">Afternoon Session</option>
                                <option value="Closing">Closing Session</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Script / Pair</label>
                        <input
                            type="text"
                            name="script"
                            required
                            placeholder="e.g. EUR/USD"
                            value={formData.script}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="Buy">Buy / Long</option>
                            <option value="Sell">Sell / Short</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity / Lots</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            step="0.01"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry Price</label>
                        <input
                            type="number"
                            name="entryPrice"
                            required
                            step="0.00001"
                            value={formData.entryPrice}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exit Price</label>
                        <input
                            type="number"
                            name="exitPrice"
                            step="0.00001"
                            value={formData.exitPrice}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Row 3 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stop Loss</label>
                        <input
                            type="number"
                            name="stopLoss"
                            step="0.00001"
                            value={formData.stopLoss}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Take Profit</label>
                        <input
                            type="number"
                            name="takeProfit"
                            step="0.00001"
                            value={formData.takeProfit}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            placeholder="Strategy used, emotions, etc."
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Live Calculations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Proj. P&L:</span>
                        <span className={`font-bold ${calculations.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {calculations.pnl > 0 ? '+' : ''}{calculations.pnl}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">R:R Ratio:</span>
                        <span className="font-bold text-gray-900 dark:text-white">1 : {calculations.rrRatio}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${calculations.status === 'Win' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                calculations.status === 'Loss' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}>
                            {calculations.status}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <Save className="mr-2 -ml-1 h-5 w-5" />
                        Save Trade
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TradeForm;
