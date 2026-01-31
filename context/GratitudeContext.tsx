'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GratitudeLine, FilterType } from '@/types/gratitude';
import { getAllGratitudeLines, saveGratitudeLine, filterGratitudeLines } from '@/lib/storage';

interface GratitudeContextType {
    gratitudeLines: GratitudeLine[];
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    addGratitudeLine: (line: GratitudeLine) => void;
    getFilteredLines: (publicKey: string | null) => GratitudeLine[];
}

const GratitudeContext = createContext<GratitudeContextType | undefined>(undefined);

export function GratitudeProvider({ children }: { children: ReactNode }) {
    const [gratitudeLines, setGratitudeLines] = useState<GratitudeLine[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');

    // Load GratitudeLines from localStorage on mount
    useEffect(() => {
        const lines = getAllGratitudeLines();
        setGratitudeLines(lines);
    }, []);

    const addGratitudeLine = useCallback((line: GratitudeLine) => {
        saveGratitudeLine(line);
        setGratitudeLines(prev => [line, ...prev]);
    }, []);

    const getFilteredLines = useCallback((publicKey: string | null): GratitudeLine[] => {
        return filterGratitudeLines(filter, publicKey);
    }, [filter]);

    return (
        <GratitudeContext.Provider
            value={{
                gratitudeLines,
                filter,
                setFilter,
                addGratitudeLine,
                getFilteredLines,
            }}
        >
            {children}
        </GratitudeContext.Provider>
    );
}

export function useGratitude() {
    const context = useContext(GratitudeContext);
    if (context === undefined) {
        throw new Error('useGratitude must be used within a GratitudeProvider');
    }
    return context;
}
