'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GratitudeLine, FilterType } from '@/types/gratitude';
import { getAllGratitude, saveGratitudeLine, filterGratitude } from '@/lib/storage';

interface GratitudeContextType {
    gratitude: GratitudeLine[];
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    addGratitudeLine: (line: GratitudeLine) => void;
    getFilteredLines: (publicKey: string | null) => GratitudeLine[];
}

const GratitudeContext = createContext<GratitudeContextType | undefined>(undefined);

export function GratitudeProvider({ children }: { children: ReactNode }) {
    const [gratitude, setGratitude] = useState<GratitudeLine[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');

    // Load gratitude from localStorage on mount
    useEffect(() => {
        const lines = getAllGratitude();
        setGratitude(lines);
    }, []);

    const addGratitudeLine = useCallback((line: GratitudeLine) => {
        saveGratitudeLine(line);
        setGratitude(prev => [line, ...prev]);
    }, []);

    const getFilteredLines = useCallback((publicKey: string | null): GratitudeLine[] => {
        return filterGratitude(filter, publicKey);
    }, [filter]);

    return (
        <GratitudeContext.Provider
            value={{
                gratitude,
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
