'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { isFreighterInstalled } from '@/lib/freighter';
import { truncateAddress } from '@/lib/stellar';

export default function Header() {
    const { publicKey, isConnected, connect, disconnect } = useWallet();
    const [hasFreighter, setHasFreighter] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const checkFreighter = async () => {
            const installed = await isFreighterInstalled();
            setHasFreighter(installed);
        };
        checkFreighter();

        // Scroll listener for header effect
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (err) {
            console.error('Connection failed:', err);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass shadow-lg'
                : 'bg-white/50 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-3 group">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                                Gratitude
                            </h1>
                        </div>
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center space-x-3">
                        {!hasFreighter ? (
                            <a
                                href="https://www.freighter.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary text-sm sm:text-base"
                            >
                                <span className="hidden sm:inline">Install Freighter</span>
                                <span className="sm:hidden">Install</span>
                            </a>
                        ) : !isConnected ? (
                            <button
                                onClick={handleConnect}
                                className="btn-primary text-sm sm:text-base"
                            >
                                <span className="hidden sm:inline">Connect Wallet</span>
                                <span className="sm:hidden">Connect</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                {/* Connected Badge */}
                                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gratitude-50 to-white border border-gratitude-200 shadow-sm">
                                    <div className="w-2 h-2 bg-gratitude-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-mono font-semibold text-gray-700">
                                        {truncateAddress(publicKey!)}
                                    </span>
                                </div>

                                {/* Mobile: Just address */}
                                <div className="sm:hidden px-3 py-2 rounded-lg bg-gratitude-50 border border-gratitude-200">
                                    <span className="text-xs font-mono font-semibold text-gray-700">
                                        {truncateAddress(publicKey!, 4)}
                                    </span>
                                </div>

                                {/* Disconnect Button */}
                                <button
                                    onClick={disconnect}
                                    className="btn-ghost text-sm"
                                    title="Disconnect"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Testnet Badge */}
            <div className="md:hidden px-4 pb-3">
                <div className="badge badge-testnet text-xs w-full justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Testnet Only - Demo Funds</span>
                </div>
            </div>
        </header>
    );
}
