import React from 'react';
import { TrendingUp, Globe } from 'lucide-react';

const WelcomeScreen = ({ onSelectMarket }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to Your Trading Journal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Select your primary market to get started
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => onSelectMarket('Indian')}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <TrendingUp className="h-5 w-5 text-indigo-300 group-hover:text-indigo-100" aria-hidden="true" />
                        </span>
                        Indian Market
                    </button>
                    <button
                        onClick={() => onSelectMarket('Forex')}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-105"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <Globe className="h-5 w-5 text-emerald-300 group-hover:text-emerald-100" aria-hidden="true" />
                        </span>
                        Forex Market
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
