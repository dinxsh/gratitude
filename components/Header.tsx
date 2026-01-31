'use client';

import { useWallet } from '@/context/WalletContext';
import { truncateAddress } from '@/lib/stellar';
import { isFreighterInstalled } from '@/lib/freighter';
import { useState, useEffect } from 'react';

export default function Header() {
    const { publicKey, isConnected, connect, disconnect, isLoading, error } = useWallet();
    const [freighterInstalled, setFreighterInstalled] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const checkFreighter = async () => {
            const installed = await isFreighterInstalled();
            setFreighterInstalled(installed);
        };
        checkFreighter();
    }, []);

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
    }, [error]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (err) {
            console.error('Connection failed:', err);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gratitude-500 to-gratitude-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">💚</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">GratitudeLines</h1>
                            <p className="text-sm text-gray-500">Stellar Testnet</p>
                        </div>
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center space-x-4">
                        {!freighterInstalled && !isConnected && (
                            <a
                                href="https://www.freighter.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gratitude-600 hover:text-gratitude-700 underline"
                            >
                                Install Freighter
                            </a>
                        )}

                        {isConnected && publicKey ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <span className="badge badge-testnet">Testnet</span>
                                    <span className="text-sm font-mono text-gray-700">
                                        {truncateAddress(publicKey, 6)}
                                    </span>
                                </div>
                                <button
                                    onClick={disconnect}
                                    className="btn-secondary text-sm px-4 py-2"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnect}
                                disabled={isLoading || !freighterInstalled}
                                className="btn-primary"
                            >
                                {isLoading ? 'Connecting...' : 'Connect Freighter'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Banner */}
                {showError && error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>
        </header>
    );
}
