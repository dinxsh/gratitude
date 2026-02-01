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
                const storedLine = getGratitudeLineByHash(hash);
                setLine(storedLine);

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
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white border border-gray-100 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gratitude-500 to-gratitude-600 rounded-xl flex items-center justify-center shadow-lg shadow-gratitude-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold gradient-text">Receipt</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gratitude-100 to-gratitude-50 rounded-full mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gratitude-600"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Verifying on Stellar Testnet...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Verification Badge */}
                        {isVerified && (
                            <div className="bg-gradient-to-r from-gratitude-50 to-gratitude-100 border-2 border-gratitude-300 rounded-2xl p-4 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gratitude-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gratitude-900">Verified on Stellar</p>
                                    <p className="text-sm text-gratitude-700">Transaction confirmed on Testnet</p>
                                </div>
                            </div>
                        )}

                        {/* Transaction Details */}
                        <div className="space-y-4">
                            {/* From/To */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-xs text-gray-500 font-semibold mb-2">FROM</p>
                                    <p className="font-bold text-gray-900 mb-1">{senderDisplay}</p>
                                    <p className="text-2xs text-gray-500 font-mono break-all">{truncateAddress(line?.senderPk || '', 8)}</p>
                                </div>
                                <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-xs text-gray-500 font-semibold mb-2">TO</p>
                                    <p className="font-bold text-gray-900 mb-1">{recipientDisplay}</p>
                                    <p className="text-2xs text-gray-500 font-mono break-all">{truncateAddress(line?.recipientPk || '', 8)}</p>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="bg-gradient-to-br from-gratitude-500 to-gratitude-600 rounded-2xl p-6 shadow-xl shadow-gratitude-500/30">
                                <p className="text-gratitude-100 text-sm font-medium mb-2">Amount</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-white">
                                        {line ? parseFloat(line.amount).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-xl font-semibold text-gratitude-100">XLM</span>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="text-sm text-gray-600 font-semibold mb-2">Message</p>
                                <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-gray-900 leading-relaxed">{line?.message || 'No message'}</p>
                                </div>
                            </div>

                            {/* Transaction Hash */}
                            <div>
                                <p className="text-sm text-gray-600 font-semibold mb-2">Transaction Hash</p>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-2">
                                    <p className="text-xs font-mono text-gray-700 break-all">{hash}</p>
                                </div>
                                <CopyButton text={hash} label="Copy Hash" />
                            </div>

                            {/* Timestamp */}
                            {line?.timestamp && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Sent</span>
                                    <span className="text-gray-900 font-medium">{new Date(line.timestamp).toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-2">
                            <a
                                href={getExplorerUrl(hash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1 text-center"
                            >
                                View on Explorer
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
