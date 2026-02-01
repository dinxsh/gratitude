import {
    isConnected as isConnectedApi,
    requestAccess,
    signTransaction as signTransactionApi,
    getNetwork as getNetworkApi,
    isAllowed as isAllowedApi
} from '@stellar/freighter-api';

/**
 * Check if Freighter is installed
 */
export async function isFreighterInstalled(): Promise<boolean> {
    try {
        const { isConnected } = await isConnectedApi();
        return !!isConnected;
    } catch (e) {
        console.warn('Error checking Freighter connection:', e);
        return false;
    }
}

/**
 * Connect to Freighter wallet and get public key
 * Uses requestAccess which prompts the user if needed
 */
export async function connectWallet(): Promise<string> {
    try {
        const response = await requestAccess();

        if (response.error) {
            throw new Error(response.error.toString());
        }

        const publicKey = response.address;

        if (!publicKey) {
            throw new Error('Failed to get public key from Freighter');
        }

        // Verify network is Testnet
        const networkResponse = await getNetworkApi();
        if (networkResponse.error) {
            console.warn('Could not verify network:', networkResponse.error);
            // Proceed cautiously or throw? Better to warn but proceed if we have address.
        } else {
            const network = networkResponse.network;
            if (network !== 'TESTNET') {
                throw new Error('Please switch Freighter to Stellar Testnet in the extension settings');
            }
        }

        return publicKey;
    } catch (error: any) {
        console.error('Error connecting wallet:', error);
        // Map common errors
        if (error.toString().includes('User declined') || error.message?.includes('User declined')) {
            throw new Error('Wallet connection was declined. Please approve the connection request.');
        }
        throw error;
    }
}

/**
 * Sign a transaction with Freighter
 */
export async function signTransactionWithFreighter(
    xdr: string,
    network: string = 'TESTNET'
): Promise<string> {
    try {
        const networkPassphrase = network === 'TESTNET'
            ? 'Test SDF Network ; September 2015'
            : 'Public Global Stellar Network ; September 2015';

        const response = await signTransactionApi(xdr, {
            networkPassphrase,
        });

        if (response.error) {
            throw new Error(response.error.toString());
        }

        return response.signedTxXdr;
    } catch (error: any) {
        console.error('Error signing transaction:', error);
        if (error.toString().includes('User declined') || error.message?.includes('User declined')) {
            throw new Error('Transaction signing was declined');
        }
        throw error;
    }
}

/**
 * Get current network from Freighter
 */
export async function getFreighterNetwork(): Promise<string> {
    try {
        const response = await getNetworkApi();
        if (response.error) {
            throw new Error(response.error.toString());
        }
        return response.network || '';
    } catch (error) {
        console.error('Error getting network:', error);
        throw error;
    }
}

/**
 * Check if user has already allowed access
 */
export async function isAllowed(): Promise<boolean> {
    try {
        const response = await isAllowedApi();
        if (response.error) {
            return false;
        }
        return !!response.isAllowed;
    } catch (error) {
        console.error('Error checking allowed status:', error);
        return false;
    }
}
