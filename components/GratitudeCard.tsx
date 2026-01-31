'use client';

import { GratitudeLine } from '@/types/gratitude';
import { truncateAddress, getExplorerUrl } from '@/lib/stellar';

interface GratitudeCardProps {
    line: GratitudeLine;
    onClick: () => void;
}

export default function GratitudeCard({ line, onClick }: GratitudeCardProps) {
    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className="group card-gradient p-5 sm:p-6 cursor-pointer hover-lift animate-fade-in-up relative overflow-hidden"
        >
            {/* Gradient accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gratitude-500 to-gratitude-400"></div>

            <div className="space-y-4">
                {/* Header: Sender → Recipient */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 font-semibold text-blue-700">
                            {line.senderAlias || truncateAddress(line.senderPk, 6)}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 font-semibold text-purple-700">
                            {line.recipientAlias || truncateAddress(line.recipientPk, 6)}
                        </span>
                    </div>

                    {/* Amount Badge */}
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gratitude-500 to-gratitude-600 shadow-lg shadow-gratitude-500/30 group-hover:shadow-xl group-hover:shadow-gratitude-500/40 transition-all">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white font-bold">{line.amount}</span>
                        <span className="text-white/90 text-sm font-medium">XLM</span>
                    </div>
                </div>

                {/* Message */}
                <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{line.message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimeAgo(line.timestamp)}</span>
                    </div>

                    <a
                        href={getExplorerUrl(line.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1 text-gratitude-600 hover:text-gratitude-700 font-medium group/link"
                    >
                        <span>View TX</span>
                        <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
