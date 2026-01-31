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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section - Not Connected */}
                {!isConnected && (
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="gradient-text">Gratitude</span>
                            <span className="text-gray-900"> on Stellar</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Turn XLM tips into public thank-you messages on Stellar Testnet
                        </p>

                        <div className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-warm-100 to-warm-50 border-2 border-warm-300 rounded-xl shadow-lg">
                            <svg className="w-5 h-5 text-warm-700" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-warm-800 font-bold">Testnet Only</span>
                            <span className="text-warm-600">·</span>
                            <span className="text-warm-700">Demo funds, not real money</span>
                        </div>
                    </div>
                )}

                {/* Connected State */}
                {isConnected ? (
                    <div className="space-y-8">
                        {/* Wallet Card */}
                        <WalletCard />

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Left: Composer */}
                            <div className="order-2 lg:order-1">
                                <GratitudeComposer />
                            </div>

                            {/* Right: Wall */}
                            <div className="order-1 lg:order-2">
                                <GratitudeWall />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Not Connected State */
                    <div className="max-w-3xl mx-auto">
                        <div className="card-glass p-8 sm:p-12 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Connect to Get Started
                            </h2>

                            <p className="text-lg text-gray-600 mb-10">
                                Install Freighter wallet, switch to Testnet, and connect to start sending GratitudeLines
                            </p>

                            {/* Steps */}
                            <div className="space-y-6 text-left max-w-lg mx-auto">
                                {[
                                    {
                                        num: '1',
                                        title: 'Install Freighter',
                                        desc: (
                                            <>
                                                Get the{' '}
                                                <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="text-gratitude-600 hover:text-gratitude-700 font-semibold underline">
                                                    Freighter browser extension
                                                </a>
                                            </>
                                        ),
                                    },
                                    {
                                        num: '2',
                                        title: 'Switch to Testnet',
                                        desc: 'Open Freighter settings and select "Testnet" network',
                                    },
                                    {
                                        num: '3',
                                        title: 'Fund Your Account',
                                        desc: (
                                            <>
                                                Get test XLM from{' '}
                                                <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer" className="text-gratitude-600 hover:text-gratitude-700 font-semibold underline">
                                                    Stellar Laboratory
                                                </a>
                                            </>
                                        ),
                                    },
                                    {
                                        num: '4',
                                        title: 'Connect & Send',
                                        desc: 'Click "Connect Wallet" in the header to start sending tips',
                                    },
                                ].map((step) => (
                                    <div key={step.num} className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 border border-gray-100 hover:shadow-md transition-all">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gratitude-500 to-gratitude-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-gratitude-500/30">
                                            {step.num}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="font-bold text-gray-900 mb-1">{step.title}</p>
                                            <p className="text-sm text-gray-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Built for <span className="font-semibold text-gray-900">Stellar White Belt Level 1</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Testnet Only · Not for Production Use · Demo Purposes
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
