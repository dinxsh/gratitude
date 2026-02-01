'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WalletState } from '@/types/gratitude';
import { connectWallet, isFreighterInstalled, getFreighterNetwork } from '@/lib/freighter';
import { getAccountBalance } from '@/lib/stellar';

interface WalletContextType extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
    refreshBalance: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [walletState, setWalletState] = useState<WalletState>({
        publicKey: null,
        balance: null,
        isConnected: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const publicKey = await connectWallet();
            const balance = await getAccountBalance(publicKey);

            setWalletState({
                publicKey,
                balance,
                isConnected: true,
            });
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to connect wallet';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setWalletState({
            publicKey: null,
            balance: null,
            isConnected: false,
        });
        setError(null);
    }, []);

    const refreshBalance = useCallback(async () => {
        if (!walletState.publicKey) return;

        try {
            const balance = await getAccountBalance(walletState.publicKey);
            setWalletState(prev => ({ ...prev, balance }));
        } catch (err: any) {
            console.error('Error refreshing balance:', err);
            setError('Failed to refresh balance');
        }
    }, [walletState.publicKey]);

    // Auto-reconnect on page load if Freighter is already connected
    useEffect(() => {
        const autoConnect = async () => {
            try {
                const installed = await isFreighterInstalled();
                if (!installed) {
                    setIsInitializing(false);
                    return;
                }

                // Check if user has previously allowed access
                const { isAllowed } = await import('@/lib/freighter');
                const allowed = await isAllowed();

                if (allowed) {
                    const network = await getFreighterNetwork();
                    if (network === 'TESTNET') {
                        // Silently reconnect
                        await connect();
                    }
                }
            } catch (err) {
                // Silently fail auto-connect - user will need to manually connect
                console.log('Auto-connect not available:', err);
            } finally {
                setIsInitializing(false);
            }
        };
        autoConnect();
    }, [connect]);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gratitude-600"></div>
            </div>
        );
    }

    return (
        <WalletContext.Provider
            value={{
                ...walletState,
                connect,
                disconnect,
                refreshBalance,
                isLoading,
                error,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
