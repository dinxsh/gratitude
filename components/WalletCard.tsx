'use client';

import { useWallet } from '@/context/WalletContext';
import { truncateAddress } from '@/lib/stellar';

export default function WalletCard() {
    const { publicKey, balance, isConnected, isLoading, error, refreshBalance } = useWallet();

    if (!isConnected) {
        return null;
    }

    return (
        <div className="card-gradient p-6 sm:p-8 animate-fade-in-up">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Your Wallet</h2>
                    <p className="text-sm text-gray-500 font-mono">{truncateAddress(publicKey!)}</p>
                </div>
                <button
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                    title="Refresh balance"
                >
                    <svg
                        className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <div className="skeleton h-16 w-full"></div>
                    <div className="skeleton h-10 w-3/4"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-1">Account Not Funded</h3>
                            <p className="text-sm text-red-700 mb-3">
                                Your Testnet account needs XLM to get started. Use Freighter's friendbot to fund your account.
                            </p>
                            <a
                                href="https://laboratory.stellar.org/#account-creator?network=test"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-sm font-semibold text-red-700 hover:text-red-800 underline"
                            >
                                <span>Fund Account via Friendbot</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Balance Display */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gratitude-500 to-gratitude-600 p-6 sm:p-8 shadow-xl shadow-gratitude-500/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative">
                            <p className="text-gratitude-100 text-sm font-medium mb-2">Available Balance</p>
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl sm:text-5xl font-bold text-white">
                                    {balance !== null ? parseFloat(balance).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 7
                                    }) : '0.00'}
                                </span>
                                <span className="text-xl sm:text-2xl font-semibold text-gratitude-100">XLM</span>
                            </div>
                            <p className="text-gratitude-100 text-xs mt-3 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>Stellar Testnet</span>
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Network</p>
                            <p className="text-sm font-semibold text-gray-900">Testnet</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-2 h-2 bg-gratitude-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold text-gray-900">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
