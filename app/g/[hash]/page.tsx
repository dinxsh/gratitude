'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GratitudeLine } from '@/types/gratitude';
import { getGratitudeLineByHash } from '@/lib/storage';
import { getTransactionDetails, truncateAddress, getExplorerUrl } from '@/lib/stellar';

export default function ReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const hash = params.hash as string;

    const [line, setLine] = useState<GratitudeLine | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReceipt = async () => {
            if (!hash) return;

            setIsLoading(true);
            setError(null);

            try {
                // Get metadata from localStorage
                const storedLine = getGratitudeLineByHash(hash);
                setLine(storedLine);

                // Verify on-chain
                const txDetails = await getTransactionDetails(hash);
                setIsVerified(txDetails.successful);
            } catch (err) {
                console.error('Error loading receipt:', err);
                setError('Failed to verify transaction on-chain');
            } finally {
                setIsLoading(false);
            }
        };

        loadReceipt();
    }, [hash]);

    const senderDisplay = line?.senderAlias || (line ? truncateAddress(line.senderPk, 6) : 'Unknown');
    const recipientDisplay = line?.recipientAlias || (line ? truncateAddress(line.recipientPk, 6) : 'Unknown');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gratitude-50">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <button
                    onClick={() => router.push('/')}
                    className="mb-6 text-gratitude-600 hover:text-gratitude-700 font-medium"
                >
                    ← Back to gratitude
                </button>

                <div className="card p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">GratitudeLine Receipt</h1>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gratitude-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Verifying on Stellar Testnet...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <p className="text-sm text-gray-600">Transaction hash: {hash}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Verification Status */}
                            <div className={`p-4 rounded-lg ${isVerified ? 'bg-gratitude-50 border border-gratitude-200' : 'bg-gray-50 border border-gray-200'
                                }`}>
                                <p className={`font-medium ${isVerified ? 'text-gratitude-700' : 'text-gray-700'}`}>
                                    {isVerified ? '✓ Confirmed on Stellar Testnet' : 'Transaction status unknown'}
                                </p>
                            </div>

                            {/* Transaction Details */}
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-1">From</p>
                                    <p className="text-lg font-semibold text-gray-900">{senderDisplay}</p>
                                    <p className="text-xs text-gray-500 font-mono break-all">{line?.senderPk}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-1">To</p>
                                    <p className="text-lg font-semibold text-gray-900">{recipientDisplay}</p>
                                    <p className="text-xs text-gray-500 font-mono break-all">{line?.recipientPk}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-1">Amount</p>
                                    <p className="text-3xl font-bold text-gratitude-600">
                                        {line ? parseFloat(line.amount).toFixed(2) : '0.00'} XLM
                                    </p>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-2">Message</p>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 text-lg">{line?.message || 'No message'}</p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-1">Transaction Hash</p>
                                    <p className="text-xs font-mono text-gray-700 break-all bg-gray-50 p-3 rounded">
                                        {hash}
                                    </p>
                                </div>

                                {line?.timestamp && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium mb-1">Sent</p>
                                        <p className="text-gray-900">{new Date(line.timestamp).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-4">
                                <a
                                    href={getExplorerUrl(hash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full text-center block"
                                >
                                    View on Stellar Expert →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
