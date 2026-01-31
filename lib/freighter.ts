import { isConnected, getPublicKey, signTransaction, getNetwork } from '@stellar/freighter-api';

/**
 * Check if Freighter is installed
 */
export async function isFreighterInstalled(): Promise<boolean> {
    return await isConnected();
}

/**
 * Connect to Freighter wallet
 */
export async function connectWallet(): Promise<string> {
    try {
        const publicKey = await getPublicKey();

        // Verify network is Testnet
        const network = await getNetwork();
        if (network !== 'TESTNET') {
            throw new Error('Please switch Freighter to Stellar Testnet');
        }

        return publicKey;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
    }
}

/**
 * Sign a transaction with Freighter
 */
export async function signTransactionWithFreighter(xdr: string, network: string): Promise<string> {
    try {
        const signedXdr = await signTransaction(xdr, {
            network,
            networkPassphrase: 'Test SDF Network ; September 2015',
        });
        return signedXdr;
    } catch (error) {
        console.error('Error signing transaction:', error);
        throw error;
    }
}

/**
 * Get current network from Freighter
 */
export async function getFreighterNetwork(): Promise<string> {
    try {
        return await getNetwork();
    } catch (error) {
        console.error('Error getting network:', error);
        throw error;
    }
}
