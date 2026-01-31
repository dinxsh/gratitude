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
            className={`sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-gray-200'
                : 'bg-white/80 backdrop-blur-sm border-gray-100'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-gray-900">
                                Gratitude
                            </h1>
                        </div>
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {!hasFreighter ? (
                            <a
                                href="https://www.freighter.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 font-bold rounded-md border border-gray-300 hover:from-gray-200 hover:to-gray-300 transition-all text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Install Freighter</span>
                                <span className="sm:hidden">Install</span>
                            </a>
                        ) : !isConnected ? (
                            <button
                                onClick={handleConnect}
                                className="px-4 py-2 bg-gray-900 text-white font-bold rounded-md hover:bg-black transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Connect Wallet</span>
                                <span className="sm:hidden">Connect</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {/* Connected Badge */}
                                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 border border-gray-300">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-mono font-bold text-gray-900">
                                        {truncateAddress(publicKey!)}
                                    </span>
                                </div>

                                {/* Mobile: Just address */}
                                <div className="sm:hidden px-2.5 py-1.5 rounded-md bg-gray-100 border border-gray-300">
                                    <span className="text-xs font-mono font-bold text-gray-900">
                                        {truncateAddress(publicKey!, 4)}
                                    </span>
                                </div>

                                {/* Disconnect Button */}
                                <button
                                    onClick={disconnect}
                                    className="p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-all"
                                    title="Disconnect"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Testnet Badge */}
            <div className="md:hidden px-4 pb-2 border-t border-gray-100">
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gray-900 rounded-md text-xs font-bold text-white uppercase tracking-wide mt-2">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Testnet Only</span>
                </div>
            </div>
        </header>
    );
}
