import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { GratitudeProvider } from "@/context/GratitudeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "gratitude - Send XLM Tips with Thank You Messages",
    description: "A social tipping dApp on Stellar Testnet. Send tiny XLM tips paired with public thank-you notes.",
    keywords: ["Stellar", "XLM", "Testnet", "Gratitude", "Tips", "Blockchain"],
    icons: {
        icon: '/favicon.svg',
    },
    openGraph: {
        title: "gratitude",
        description: "Send tiny XLM tips with public thank-you notes on Stellar Testnet",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ErrorBoundary>
                    <WalletProvider>
                        <GratitudeProvider>
                            {children}
                        </GratitudeProvider>
                    </WalletProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
