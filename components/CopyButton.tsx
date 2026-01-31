'use client';

import { useState } from 'react';

interface CopyButtonProps {
    text: string;
    label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className="inline-flex items-center space-x-1 text-sm font-medium text-gratitude-700 hover:text-gratitude-800 transition-colors"
        >
            <span>{copied ? '✓ Copied!' : `📋 ${label}`}</span>
        </button>
    );
}
