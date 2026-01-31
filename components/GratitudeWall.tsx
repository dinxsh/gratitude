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

    const filters: { value: FilterType; label: string; icon: string }[] = [
        { value: 'all', label: 'All', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { value: 'sent', label: 'Sent', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
        { value: 'received', label: 'Received', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4' },
    ];

    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <div className="card-gradient p-6 sm:p-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Gratitude Wall</h2>
                    <p className="text-sm text-gray-500">
                        {filteredLines.length} {filteredLines.length === 1 ? 'message' : 'messages'}
                    </p>
                </div>

                {/* Filter Controls */}
                {isConnected && (
                    <div className="flex items-center space-x-2 bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
                        {filters.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => handleFilterChange(f.value)}
                                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === f.value
                                        ? 'bg-gradient-to-r from-gratitude-500 to-gratitude-600 text-white shadow-lg shadow-gratitude-500/30'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                disabled={!isConnected && f.value !== 'all'}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                                </svg>
                                <span className="hidden sm:inline">{f.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* GratitudeLines List */}
            {filteredLines.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gratitude-100 to-gratitude-50 rounded-full mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-gratitude-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {filter === 'all' ? 'No GratitudeLines Yet' :
                            filter === 'sent' ? "You Haven't Sent Any" :
                                "You Haven't Received Any"}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                        {filter === 'all'
                            ? 'Be the first to send a GratitudeLine! Connect your wallet and send a thank-you tip to get started.'
                            : filter === 'sent'
                                ? "Send your first thank-you tip above to spread some gratitude!"
                                : "Share your address with others to receive GratitudeLines."}
                    </p>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            className="btn-secondary"
                        >
                            View All GratitudeLines
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Cards Grid */}
                    <div className="space-y-4 mb-6">
                        {paginatedLines.map((line, index) => (
                            <div
                                key={line.hash}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <GratitudeCard
                                    line={line}
                                    onClick={() => setSelectedHash(line.hash)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === pageNum
                                                    ? 'bg-gradient-to-r from-gratitude-500 to-gratitude-600 text-white shadow-lg shadow-gratitude-500/30'
                                                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
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
