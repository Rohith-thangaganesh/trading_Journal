import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = ({ trades }) => {
    // Calculate Stats
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.status === 'Win').length;
    const losses = trades.filter(t => t.status === 'Loss').length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;

    const totalPnL = trades.reduce((acc, t) => acc + (t.pnl || 0), 0).toFixed(2);

    const avgRR = trades.length > 0
        ? (trades.reduce((acc, t) => acc + (t.rrRatio || 0), 0) / trades.length).toFixed(2)
        : 0;

    // Prepare Chart Data
    // Sort trades by date ascending for the chart
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));

    let cumulativePnL = 0;
    const equityCurve = sortedTrades.map(t => {
        cumulativePnL += (t.pnl || 0);
        return cumulativePnL;
    });

    const chartData = {
        labels: sortedTrades.map(t => t.date),
        datasets: [
            {
                label: 'Equity Curve',
                data: equityCurve,
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
                    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
                    return gradient;
                },
                borderColor: '#22c55e',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9ca3af',
                }
            },
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    color: '#9ca3af',
                }
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100').replace('500', '100')} dark:bg-opacity-20`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Trades"
                    value={totalTrades}
                    icon={Activity}
                    color="text-blue-600"
                />
                <StatCard
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon={Target}
                    color={parseFloat(winRate) >= 50 ? "text-green-600" : "text-orange-600"}
                    subtext={`${wins} W - ${losses} L`}
                />
                <StatCard
                    title="Net P&L"
                    value={`${totalPnL > 0 ? '+' : ''}${totalPnL}`}
                    icon={totalPnL >= 0 ? TrendingUp : TrendingDown}
                    color={totalPnL >= 0 ? "text-green-600" : "text-red-600"}
                />
                <StatCard
                    title="Avg R:R"
                    value={avgRR}
                    icon={Activity}
                    color="text-purple-600"
                />
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Curve</h3>
                <div className="h-80 w-full">
                    {trades.length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            No data available to chart
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
