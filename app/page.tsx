'use client';

import { useWallet } from '@/context/WalletContext';
import Header from '@/components/Header';
import WalletCard from '@/components/WalletCard';
import GratitudeComposer from '@/components/GratitudeComposer';
import GratitudeWall from '@/components/GratitudeWall';

export default function Home() {
    const { isConnected } = useWallet();

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                {!isConnected && (
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Send Tiny XLM Tips with Public Thank-You Notes
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">
                            GratitudeLines turns Stellar Testnet payments into visible messages of appreciation
                        </p>
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-warm-100 border border-warm-300 rounded-lg">
                            <span className="text-warm-700 font-medium">⚠️ Testnet Only</span>
                            <span className="text-warm-600">·</span>
                            <span className="text-warm-600 text-sm">Demo funds only, not real money</span>
                        </div>
                    </div>
                )}

                {/* Connected State */}
                {isConnected ? (
                    <div className="space-y-8">
                        {/* Wallet Card */}
                        <WalletCard />

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: Composer */}
                            <div>
                                <GratitudeComposer />
                            </div>

                            {/* Right: Wall */}
                            <div>
                                <GratitudeWall />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Not Connected State */
                    <div className="max-w-2xl mx-auto">
                        <div className="card p-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gratitude-500 to-gratitude-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">💚</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Connect Freighter to Get Started
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Install the Freighter wallet extension, switch to Stellar Testnet, and connect to start sending GratitudeLines.
                            </p>
                            <div className="space-y-4 text-left max-w-md mx-auto">
                                <div className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gratitude-100 text-gratitude-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Install Freighter</p>
                                        <p className="text-sm text-gray-600">
                                            Get the{' '}
                                            <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="text-gratitude-600 underline">
                                                Freighter browser extension
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gratitude-100 text-gratitude-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Switch to Testnet</p>
                                        <p className="text-sm text-gray-600">Open Freighter settings and select "Testnet"</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gratitude-100 text-gratitude-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Fund Your Account</p>
                                        <p className="text-sm text-gray-600">
                                            Get test XLM from{' '}
                                            <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer" className="text-gratitude-600 underline">
                                                Stellar Laboratory
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gratitude-100 text-gratitude-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Connect & Send</p>
                                        <p className="text-sm text-gray-600">Click "Connect Freighter" above to start sending tips</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
                    <p>Built for Stellar White Belt Level 1 · Testnet Only · Not for Production Use</p>
                </div>
            </footer>
        </div>
    );
}
