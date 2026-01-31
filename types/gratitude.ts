export interface GratitudeLine {
    hash: string;
    senderPk: string;
    recipientPk: string;
    senderAlias?: string;
    recipientAlias?: string;
    message: string;
    amount: string;
    timestamp: number;
}

export interface WalletState {
    publicKey: string | null;
    balance: string | null;
    isConnected: boolean;
}

export type FilterType = 'all' | 'sent' | 'received';

export interface TransactionResult {
    success: boolean;
    hash?: string;
    error?: string;
}
