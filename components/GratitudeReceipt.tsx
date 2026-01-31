'use client';

import { useEffect, useState } from 'react';
import { GratitudeLine } from '@/types/gratitude';
import { getGratitudeLineByHash } from '@/lib/storage';
import { getTransactionDetails, truncateAddress, getExplorerUrl } from '@/lib/stellar';
import CopyButton from './CopyButton';

interface GratitudeReceiptProps {
    hash: string;
    onClose: () => void;
}

export default function GratitudeReceipt({ hash, onClose }: GratitudeReceiptProps) {
    const [line, setLine] = useState<GratitudeLine | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReceipt = async () => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">GratitudeLine Receipt</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gratitude-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Verifying on Stellar Testnet...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Verification Status */}
                        <div className={`p-3 rounded-lg ${isVerified ? 'bg-gratitude-50 border border-gratitude-200' : 'bg-gray-50 border border-gray-200'
                            }`}>
                            <p className={`text-sm font-medium ${isVerified ? 'text-gratitude-700' : 'text-gray-700'}`}>
                                {isVerified ? '✓ Confirmed on Stellar Testnet' : 'Transaction status unknown'}
                            </p>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">From</p>
                                <p className="text-gray-900">{senderDisplay}</p>
                                <p className="text-xs text-gray-500 font-mono">{line?.senderPk}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 font-medium">To</p>
                                <p className="text-gray-900">{recipientDisplay}</p>
                                <p className="text-xs text-gray-500 font-mono">{line?.recipientPk}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 font-medium">Amount</p>
                                <p className="text-2xl font-bold text-gratitude-600">
                                    {line ? parseFloat(line.amount).toFixed(2) : '0.00'} XLM
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Message</p>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{line?.message || 'No message'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Transaction Hash</p>
                                <p className="text-xs font-mono text-gray-700 break-all bg-gray-50 p-2 rounded mb-2">
                                    {hash}
                                </p>
                                <CopyButton text={hash} label="Copy Hash" />
                            </div>

                            {line?.timestamp && (
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Sent</p>
                                    <p className="text-gray-900">{new Date(line.timestamp).toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-4">
                            <a
                                href={getExplorerUrl(hash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1 text-center"
                            >
                                View on Stellar Expert
                            </a>
                            <button
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
