'use client';

import { GratitudeLine } from '@/types/gratitude';
import { truncateAddress, getExplorerUrl } from '@/lib/stellar';
import { formatRelativeTime } from '@/lib/storage';

interface GratitudeCardProps {
    line: GratitudeLine;
    onClick?: () => void;
}

export default function GratitudeCard({ line, onClick }: GratitudeCardProps) {
    const senderDisplay = line.senderAlias || truncateAddress(line.senderPk, 4);
    const recipientDisplay = line.recipientAlias || truncateAddress(line.recipientPk, 4);

    return (
        <div
            className="card p-5 cursor-pointer hover:shadow-xl transition-all duration-200 animate-slide-up"
            onClick={onClick}
        >
            {/* Header: Sender → Recipient · Amount */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{senderDisplay}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-gray-900">{recipientDisplay}</span>
                </div>
                <span className="text-lg font-bold text-gratitude-600">
                    {parseFloat(line.amount).toFixed(2)} XLM
                </span>
            </div>

            {/* Message */}
            <p className="text-gray-700 mb-3 line-clamp-2">{line.message}</p>

            {/* Footer: Time and View Link */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{formatRelativeTime(line.timestamp)}</span>
                <a
                    href={getExplorerUrl(line.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gratitude-600 hover:text-gratitude-700 font-medium underline"
                >
                    View tx →
                </a>
            </div>
        </div>
    );
}
