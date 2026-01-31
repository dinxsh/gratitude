'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useGratitude } from '@/context/GratitudeContext';
import { isValidStellarAddress, buildPaymentTransaction, submitTransaction, getExplorerUrl } from '@/lib/stellar';
import { signTransactionWithFreighter } from '@/lib/freighter';
import { GratitudeLine } from '@/types/gratitude';
import CopyButton from './CopyButton';

export default function GratitudeComposer() {
    const { publicKey, balance, refreshBalance } = useWallet();
    const { addGratitudeLine } = useGratitude();

    const [formData, setFormData] = useState({
        recipientAddress: '',
        amount: '',
        senderAlias: '',
        recipientAlias: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string } | null>(null);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.recipientAddress) {
            newErrors.recipientAddress = 'Recipient address is required';
        } else if (!isValidStellarAddress(formData.recipientAddress)) {
            newErrors.recipientAddress = 'Invalid Stellar address';
        } else if (publicKey && formData.recipientAddress === publicKey) {
            newErrors.recipientAddress = 'Cannot send to yourself';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else {
            const amount = parseFloat(formData.amount);
            const MIN_AMOUNT = 0.01;
            if (isNaN(amount) || amount <= 0) {
                newErrors.amount = 'Amount must be greater than 0';
            } else if (amount < MIN_AMOUNT) {
                newErrors.amount = `Minimum amount is ${MIN_AMOUNT} XLM`;
            } else if (balance && amount > parseFloat(balance)) {
                newErrors.amount = 'Insufficient balance';
            }
        }

        if (!formData.message) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        } else if (formData.message.length > 140) {
            newErrors.message = 'Message must be 140 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey) {
            setTxResult({ success: false, error: 'Please connect your wallet first' });
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setTxResult(null);

        try {
            // Build transaction
            const xdr = await buildPaymentTransaction(
                publicKey,
                formData.recipientAddress,
                formData.amount,
                formData.message.substring(0, 28)
            );

            // Sign with Freighter
            const signedXdr = await signTransactionWithFreighter(xdr, 'TESTNET');

            // Submit to Horizon
            const hash = await submitTransaction(signedXdr);

            // Create GratitudeLine object
            const gratitudeLine: GratitudeLine = {
                hash,
                senderPk: publicKey,
                recipientPk: formData.recipientAddress,
                senderAlias: formData.senderAlias || undefined,
                recipientAlias: formData.recipientAlias || undefined,
                message: formData.message,
                amount: formData.amount,
                timestamp: Date.now(),
            };

            // Save to context and localStorage
            addGratitudeLine(gratitudeLine);

            // Refresh balance
            await refreshBalance();

            // Show success
            setTxResult({ success: true, hash });

            // Reset form
            setFormData({
                recipientAddress: '',
                amount: '',
                senderAlias: '',
                recipientAlias: '',
                message: '',
            });

        } catch (err: any) {
            console.error('Transaction error:', err);
            let errorMessage = 'Transaction failed';

            if (err.message?.includes('User declined')) {
                errorMessage = 'Transaction rejected in Freighter';
            } else if (err.message?.includes('insufficient')) {
                errorMessage = 'Insufficient funds';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setTxResult({ success: false, error: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="card p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send a GratitudeLine</h2>
            <p className="text-sm text-gray-600 mb-6">
                Send a tiny XLM tip with a public thank-you message on Stellar Testnet
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Recipient Address */}
                <div>
                    <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="recipientAddress"
                        name="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={handleChange}
                        placeholder="G..."
                        className={`input-field ${errors.recipientAddress ? 'border-red-500' : ''}`}
                    />
                    {errors.recipientAddress && (
                        <p className="text-sm text-red-600 mt-1">{errors.recipientAddress}</p>
                    )}
                </div>

                {/* Amount */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Tip Amount (XLM) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="2.00"
                        step="0.01"
                        min="0"
                        className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                    )}
                </div>

                {/* Sender Alias */}
                <div>
                    <label htmlFor="senderAlias" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name (optional)
                    </label>
                    <input
                        type="text"
                        id="senderAlias"
                        name="senderAlias"
                        value={formData.senderAlias}
                        onChange={handleChange}
                        placeholder="Alice"
                        className="input-field"
                    />
                </div>

                {/* Recipient Alias */}
                <div>
                    <label htmlFor="recipientAlias" className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Name (optional)
                    </label>
                    <input
                        type="text"
                        id="recipientAlias"
                        name="recipientAlias"
                        value={formData.recipientAlias}
                        onChange={handleChange}
                        placeholder="Bob"
                        className="input-field"
                    />
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message of Gratitude <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Thanks for reviewing my code!"
                        rows={3}
                        className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.message ? (
                            <p className="text-sm text-red-600">{errors.message}</p>
                        ) : (
                            <p className="text-xs text-gray-500">10-140 characters</p>
                        )}
                        <p className="text-xs text-gray-500">{formData.message.length}/140</p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !publicKey}
                    className="btn-primary w-full"
                >
                    {isSubmitting ? 'Broadcasting GratitudeLine...' : 'Send GratitudeLine'}
                </button>
            </form>

            {/* Success/Error Messages */}
            {txResult && (
                <div className={`mt-4 p-4 rounded-lg animate-slide-up ${txResult.success ? 'bg-gratitude-50 border border-gratitude-200' : 'bg-red-50 border border-red-200'
                    }`}>
                    {txResult.success ? (
                        <div>
                            <p className="font-medium text-gratitude-800 mb-2">✓ GratitudeLine sent successfully!</p>
                            <p className="text-sm text-gratitude-700 mb-2">Transaction Hash:</p>
                            <p className="text-xs font-mono text-gratitude-600 break-all mb-2">{txResult.hash}</p>
                            <div className="flex items-center space-x-3 mb-3">
                                <CopyButton text={txResult.hash!} label="Copy Hash" />
                                <a
                                    href={getExplorerUrl(txResult.hash!)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gratitude-700 hover:text-gratitude-800 underline"
                                >
                                    View on Stellar Expert →
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium text-red-800 mb-1">✗ Transaction Failed</p>
                            <p className="text-sm text-red-700">{txResult.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
