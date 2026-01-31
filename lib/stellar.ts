import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// Initialize Horizon server
export const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Get XLM balance for a Stellar account
 */
export async function getAccountBalance(publicKey: string): Promise<string | null> {
    try {
        const account = await server.loadAccount(publicKey);
        const nativeBalance = account.balances.find(
            (balance) => balance.asset_type === 'native'
        );
        return nativeBalance ? (nativeBalance as any).balance : null;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
}

/**
 * Build a payment transaction
 */
export async function buildPaymentTransaction(
    sourcePublicKey: string,
    destinationPublicKey: string,
    amount: string,
    memo?: string
): Promise<string> {
    try {
        const sourceAccount = await server.loadAccount(sourcePublicKey);

        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination: destinationPublicKey,
                    asset: StellarSdk.Asset.native(),
                    amount: amount,
                })
            )
            .setTimeout(180);

        if (memo) {
            transaction.addMemo(StellarSdk.Memo.text(memo.substring(0, 28)));
        }

        const builtTransaction = transaction.build();
        return builtTransaction.toXDR();
    } catch (error) {
        console.error('Error building transaction:', error);
        throw error;
    }
}

/**
 * Submit a signed transaction to Horizon
 */
export async function submitTransaction(signedXdr: string): Promise<string> {
    try {
        const transaction = StellarSdk.TransactionBuilder.fromXDR(
            signedXdr,
            NETWORK_PASSPHRASE
        );
        const result = await server.submitTransaction(transaction as StellarSdk.Transaction);
        return result.hash;
    } catch (error) {
        console.error('Error submitting transaction:', error);
        throw error;
    }
}

/**
 * Get transaction details from Horizon
 */
export async function getTransactionDetails(hash: string) {
    try {
        const transaction = await server.transactions().transaction(hash).call();
        return transaction;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
}

/**
 * Validate a Stellar address
 */
export function isValidStellarAddress(address: string): boolean {
    try {
        StellarSdk.Keypair.fromPublicKey(address);
        return true;
    } catch {
        return false;
    }
}

/**
 * Truncate a Stellar address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

/**
 * Get Stellar Expert explorer URL for a transaction
 */
export function getExplorerUrl(hash: string): string {
    return `${process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://stellar.expert/explorer/testnet/tx'}/${hash}`;
}
