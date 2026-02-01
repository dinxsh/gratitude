'use client';

import { useWallet } from '@/context/WalletContext';
import { useGratitude } from '@/context/GratitudeContext';
import Header from '@/components/Header';
import WalletCard from '@/components/WalletCard';
import GratitudeComposer from '@/components/GratitudeComposer';
import GratitudeWall from '@/components/GratitudeWall';
import StatCounter from '@/components/StatCounter';

export default function Home() {
    const { isConnected, connect } = useWallet();
    const { gratitude } = useGratitude();

    const handleConnect = async () => {
        try {
            await connect();
        } catch (err: any) {
            console.error('Connection failed:', err);
            const errorMsg = err?.message || 'Failed to connect wallet. Please try again.';
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section - Not Connected */}
                {!isConnected && (
                    <>
                        {/* Hero */}
                        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16">
                            <div className="max-w-6xl mx-auto">
                                {/* Status Badge */}
                                <div className="flex items-center justify-center mb-6">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black rounded-sm">
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live • Stellar Testnet</span>
                                    </div>
                                </div>

                                {/* Main Headline */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-3 leading-none">
                                        <span className="block text-black">Blockchain Gratitude</span>
                                        <span className="block text-gray-400">Immutable & Verifiable</span>
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600 leading-snug max-w-xl mx-auto mt-4">
                                        Send XLM tips with messages. Cryptographically signed, permanently recorded on Stellar.
                                        <span className="block mt-1 text-xs text-gray-500">3-5 second finality • Sub-cent fees • Public verification</span>
                                    </p>
                                </div>

                                {/* CTA Row */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-10">
                                    <button onClick={handleConnect} className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-sm font-black rounded-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-xl">
                                        CONNECT WALLET
                                    </button>
                                    <a href="#features" className="w-full sm:w-auto px-6 py-2.5 bg-white text-black text-sm font-black rounded-sm border-2 border-black hover:bg-black hover:text-white transition-all">
                                        VIEW FEATURES
                                    </a>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-4 gap-2 max-w-3xl mx-auto">
                                    {[
                                        { value: gratitude.length, label: 'Messages', suffix: '+' },
                                        { value: 100, label: 'Users', suffix: '+' },
                                        { value: 99, label: 'Uptime', suffix: '%' },
                                        { value: 10000, label: 'XLM', suffix: '+' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white border-2 border-gray-200 hover:border-black transition-all p-3 group">
                                            <div className="text-2xl sm:text-3xl font-black text-black mb-0.5 tabular-nums">
                                                <StatCounter end={stat.value} suffix={stat.suffix} />
                                            </div>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Technical Features */}
                        <section id="features" className="py-12 bg-white border-y-2 border-gray-200">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 uppercase tracking-tight">
                                        Technical Specifications
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Enterprise-grade blockchain infrastructure for social payments
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        {
                                            icon: '⚡',
                                            title: 'Instant Settlement',
                                            metric: '3-5 sec',
                                            description: 'Stellar Consensus Protocol (SCP) provides Byzantine fault-tolerant finality in seconds. Transactions are cryptographically signed and permanently recorded with hash verification.',
                                            tech: 'SCP Consensus'
                                        },
                                        {
                                            icon: '🔐',
                                            title: 'Cryptographic Security',
                                            metric: 'Ed25519',
                                            description: 'Military-grade elliptic curve signatures via Freighter wallet. Private keys never leave your device. All transactions are immutable and verifiable on-chain.',
                                            tech: 'EdDSA Signatures'
                                        },
                                        {
                                            icon: '👁️',
                                            title: 'Public Transparency',
                                            metric: '100% Auditable',
                                            description: 'Every gratitude message appears on the public wall with direct Stellar Expert explorer links. Anyone can independently verify transaction authenticity and history.',
                                            tech: 'Open Ledger'
                                        },
                                        {
                                            icon: '💰',
                                            title: 'Minimal Network Fees',
                                            metric: '~$0.00001',
                                            description: 'Stellar\'s efficient consensus mechanism means base fees are 100 stroops (0.00001 XLM). More value reaches recipients, not validators or miners.',
                                            tech: 'Fixed Base Fee'
                                        },
                                        {
                                            icon: '📜',
                                            title: 'Permanent Receipts',
                                            metric: 'Immutable',
                                            description: 'Each transaction generates a unique cryptographic hash. Share receipts on social media, portfolios, or resumes as verifiable proof of community contribution.',
                                            tech: 'SHA-256 Hashing'
                                        },
                                        {
                                            icon: '🌐',
                                            title: 'Decentralized Network',
                                            metric: 'Global Nodes',
                                            description: 'Built on Stellar\'s distributed network of validators. No single point of failure. Censorship-resistant and permissionless by design.',
                                            tech: 'Federated Byzantine'
                                        },
                                    ].map((feature, i) => (
                                        <div key={i} className="bg-gray-50 border-2 border-gray-200 hover:border-black transition-all p-4 group">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="text-2xl">{feature.icon}</span>
                                                <span className="text-[10px] font-black text-white bg-black px-2 py-0.5 uppercase tracking-wider">
                                                    {feature.metric}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-black text-black mb-2 uppercase tracking-tight">
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs text-gray-700 leading-relaxed mb-2">
                                                {feature.description}
                                            </p>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                {feature.tech}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* How It Works */}
                        <section className="py-12 bg-gray-50">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 uppercase tracking-tight">
                                        Integration Protocol
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Three-step workflow for blockchain gratitude
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {[
                                        {
                                            step: '01',
                                            title: 'Wallet Connection',
                                            description: 'Install Freighter browser extension and connect to Stellar Testnet',
                                            details: [
                                                'Download Freighter from official source',
                                                'Create or import Stellar account (G-address)',
                                                'Switch network to Testnet in settings',
                                                'Authorize dApp connection (read-only initially)'
                                            ]
                                        },
                                        {
                                            step: '02',
                                            title: 'Message Composition',
                                            description: 'Configure recipient, amount, and gratitude message payload',
                                            details: [
                                                'Input recipient public key (56-char G-address)',
                                                'Set XLM amount (min: 0.01 XLM + base fee)',
                                                'Compose gratitude message (max: 28 bytes)',
                                                'Optional: Add sender/recipient display names'
                                            ]
                                        },
                                        {
                                            step: '03',
                                            title: 'Transaction Signing',
                                            description: 'Sign with Ed25519 private key and broadcast to network',
                                            details: [
                                                'Review transaction XDR in Freighter popup',
                                                'Sign with password or biometric authentication',
                                                'Receive transaction hash (64-char hex)',
                                                'Verify on Stellar Expert blockchain explorer'
                                            ]
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="relative">
                                            <div className="bg-white border-2 border-gray-200 hover:border-black transition-all p-5 h-full">
                                                <div className="text-5xl font-black text-gray-200 mb-2 leading-none">{item.step}</div>
                                                <h3 className="text-lg font-black text-black mb-2 uppercase tracking-tight">{item.title}</h3>
                                                <p className="text-xs text-gray-700 mb-3 leading-relaxed">{item.description}</p>
                                                <ul className="space-y-1.5">
                                                    {item.details.map((detail, j) => (
                                                        <li key={j} className="flex items-start gap-2">
                                                            <span className="text-black font-black text-xs mt-0.5">→</span>
                                                            <span className="text-[11px] text-gray-600 leading-snug">{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {i < 2 && (
                                                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                                    <div className="w-4 h-4 bg-black rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Testnet Notice */}
                        <section className="py-10 bg-black border-y-2 border-gray-800">
                            <div className="max-w-4xl mx-auto text-center px-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-400 mb-3">
                                    <span className="text-black font-black text-xl">!</span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                                    Testnet Environment
                                </h3>
                                <p className="text-xs text-gray-400 mb-5 leading-relaxed max-w-2xl mx-auto">
                                    This application operates exclusively on <span className="text-white font-bold">Stellar Testnet</span> for educational and demonstration purposes.
                                    Test XLM has zero monetary value. All transactions are recorded on the test blockchain, not production mainnet.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                    <a
                                        href="https://laboratory.stellar.org/#account-creator?network=test"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2 bg-white text-black text-xs font-black hover:bg-gray-200 transition-all uppercase tracking-wider"
                                    >
                                        <span>⚡</span>
                                        Get Test XLM
                                    </a>
                                    <a
                                        href="https://www.freighter.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-xs font-black border-2 border-gray-700 hover:bg-gray-800 transition-all uppercase tracking-wider"
                                    >
                                        <span>🔐</span>
                                        Install Freighter
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Final CTA */}
                        <section className="py-12 bg-white">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="text-2xl sm:text-3xl font-black text-black mb-3 uppercase tracking-tight">
                                    Start Sending Gratitude
                                </h2>
                                <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
                                    Join the community making appreciation permanent, transparent, and verifiable on the blockchain
                                </p>
                                <button onClick={handleConnect} className="px-8 py-3 bg-black text-white text-sm font-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-2xl uppercase tracking-wider">
                                    Connect Wallet Now
                                </button>
                            </div>
                        </section>
                    </>
                )}

                {/* Connected State */}
                {isConnected && (
                    <div className="py-8 space-y-8">
                        <WalletCard />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="order-2 lg:order-1">
                                <GratitudeComposer />
                            </div>
                            <div className="order-1 lg:order-2">
                                <GratitudeWall />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Built for <span className="font-semibold text-gray-900">Stellar White Belt Level 1</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Testnet Only · Educational Purpose · Not for Production Use
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
