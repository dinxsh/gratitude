'use client';

import { useWallet } from '@/context/WalletContext';
import { truncateAddress } from '@/lib/stellar';

export default function WalletCard() {
    const { publicKey, balance, isConnected, refreshBalance, isLoading } = useWallet();

    if (!isConnected) {
        return null;
    }

    const isUnfunded = balance === '0' || balance === null;

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Your Wallet</h2>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                        {publicKey && truncateAddress(publicKey, 8)}
                    </p>
                </div>
                <button
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className="text-sm text-gratitude-600 hover:text-gratitude-700 font-medium"
                >
                    {isLoading ? '↻' : '↻ Refresh'}
                </button>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                ) : isUnfunded ? (
                    <div>
                        <p className="text-3xl font-bold text-gray-400">0 XLM</p>
                        <div className="mt-3 p-3 bg-warm-50 border border-warm-200 rounded-lg">
                            <p className="text-sm text-warm-800 font-medium">Account not funded</p>
                            <p className="text-xs text-warm-700 mt-1">
                                Get test XLM from{' '}
                                <a
                                    href="https://laboratory.stellar.org/#account-creator?network=test"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline font-medium"
                                >
                                    Stellar Laboratory
                                </a>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Available XLM (Testnet)</p>
                        <p className="text-4xl font-bold text-gratitude-600 mt-1">
                            {balance ? parseFloat(balance).toFixed(2) : '0.00'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
