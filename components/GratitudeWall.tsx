'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useGratitude } from '@/context/GratitudeContext';
import { FilterType } from '@/types/gratitude';
import GratitudeCard from './GratitudeCard';
import GratitudeReceipt from './GratitudeReceipt';

const ITEMS_PER_PAGE = 20;

export default function GratitudeWall() {
    const { publicKey, isConnected } = useWallet();
    const { filter, setFilter, getFilteredLines } = useGratitude();
    const [selectedHash, setSelectedHash] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredLines = getFilteredLines(publicKey);
    const totalPages = Math.ceil(filteredLines.length / ITEMS_PER_PAGE);
    const paginatedLines = filteredLines.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const filters: { value: FilterType; label: string }[] = [
        { value: 'all', label: 'All GratitudeLines' },
        { value: 'sent', label: 'Sent by me' },
        { value: 'received', label: 'To my address' },
    ];

    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gratitude Wall</h2>

                {/* Filter Controls */}
                {isConnected && (
                    <div className="flex space-x-2">
                        {filters.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => handleFilterChange(f.value)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${filter === f.value
                                        ? 'bg-gratitude-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                disabled={!isConnected && f.value !== 'all'}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* GratitudeLines List */}
            {filteredLines.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gratitude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">💚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No GratitudeLines yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        {filter === 'all'
                            ? 'Be the first to send a GratitudeLine! Connect your wallet and send a thank-you tip to get started.'
                            : filter === 'sent'
                                ? "You haven't sent any GratitudeLines yet. Send your first thank-you tip above!"
                                : "You haven't received any GratitudeLines yet."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {paginatedLines.map((line) => (
                            <GratitudeCard
                                key={line.hash}
                                line={line}
                                onClick={() => setSelectedHash(line.hash)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Receipt Modal */}
            {selectedHash && (
                <GratitudeReceipt
                    hash={selectedHash}
                    onClose={() => setSelectedHash(null)}
                />
            )}
        </div>
    );
}
