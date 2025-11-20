import React, { useState, useEffect } from 'react';
import { Moon, Sun, LayoutDashboard, BookOpen, Download } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, onExport, currentMarket, onMarketChange }) => {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                TradeJournal
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 mr-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Market:</span>
                                <select
                                    value={currentMarket}
                                    onChange={(e) => onMarketChange(e.target.value)}
                                    className="block w-32 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Indian">Indian</option>
                                    <option value="Forex">Forex</option>
                                </select>
                            </div>
                            <button
                                onClick={onExport}
                                className="hidden md:flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Download size={16} className="mr-2" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`pb-4 px-2 flex items-center space-x-2 font-medium text-sm transition-colors relative ${activeTab === 'journal'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        <BookOpen size={18} />
                        <span>Journal</span>
                        {activeTab === 'journal' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`pb-4 px-2 flex items-center space-x-2 font-medium text-sm transition-colors relative ${activeTab === 'dashboard'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                        {activeTab === 'dashboard' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                        )}
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
};

export default Layout;
