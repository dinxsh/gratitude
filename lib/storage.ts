import { GratitudeLine, FilterType } from '@/types/gratitude';

const STORAGE_KEY = 'gratitudelines';

/**
 * Save a GratitudeLine to localStorage
 */
export function saveGratitudeLine(line: GratitudeLine): void {
    try {
        const lines = getAllGratitudeLines();
        lines.unshift(line); // Add to beginning (newest first)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (error) {
        console.error('Error saving GratitudeLine:', error);
    }
}

/**
 * Get all GratitudeLines from localStorage
 */
export function getAllGratitudeLines(): GratitudeLine[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading GratitudeLines:', error);
        return [];
    }
}

/**
 * Get a specific GratitudeLine by transaction hash
 */
export function getGratitudeLineByHash(hash: string): GratitudeLine | null {
    const lines = getAllGratitudeLines();
    return lines.find(line => line.hash === hash) || null;
}

/**
 * Filter GratitudeLines based on filter type and user's public key
 */
export function filterGratitudeLines(
    filter: FilterType,
    publicKey: string | null
): GratitudeLine[] {
    const allLines = getAllGratitudeLines();

    if (filter === 'all' || !publicKey) {
        return allLines;
    }

    if (filter === 'sent') {
        return allLines.filter(line => line.senderPk === publicKey);
    }

    if (filter === 'received') {
        return allLines.filter(line => line.recipientPk === publicKey);
    }

    return allLines;
}

/**
 * Format timestamp to relative time (e.g., "2 min ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}
