# Gratitude 💚

**A social tipping dApp on Stellar Testnet where users send XLM tips with public thank-you messages.**

Built for the Stellar White Belt Level 1 challenge, GratitudeLines transforms simple Stellar payments into visible messages of appreciation. Each tip becomes a "GratitudeLine" - a public thank-you note paired with a real on-chain transaction.

![Testnet Only](https://img.shields.io/badge/Network-Stellar%20Testnet-orange)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

## ✨ Features

- **🔐 Freighter Wallet Integration** - Connect/disconnect with Freighter on Stellar Testnet
- **💰 Balance Display** - Real-time XLM balance fetched from Horizon Testnet
- **💚 Send GratitudeLines** - Send XLM tips with personalized thank-you messages
- **📜 Gratitude Wall** - Public feed of all GratitudeLines with filtering options
- **🔍 Transaction Verification** - Every GratitudeLine links to its transaction on Stellar Expert
- **📱 Shareable Receipts** - Unique URLs for each GratitudeLine (`/g/<txHash>`)
- **✅ On-Chain Confirmation** - Automatic verification of transactions via Horizon API

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom gratitude-themed design tokens
- **Stellar Integration**: 
  - `@stellar/stellar-sdk` v12+ for Horizon API and transaction building
  - `@stellar/freighter-api` for wallet connection and signing
- **Network**: Stellar Testnet only (`https://horizon-testnet.stellar.org`)
- **Data Storage**: Client-side localStorage (no backend required)

## 🚀 Quick Start

### Prerequisites

1. **Node.js** 18+ and npm
2. **Freighter Wallet** - [Install the browser extension](https://www.freighter.app/)
3. **Testnet XLM** - Fund your account via [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gratitudelines-stellar-whitebelt.git
cd gratitudelines-stellar-whitebelt

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setup Freighter for Testnet

1. Install the [Freighter browser extension](https://www.freighter.app/)
2. Create or import a wallet
3. Open Freighter settings
4. Switch network to **"Testnet"**
5. Fund your account:
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Paste your public key
   - Click "Get test network lumens"

## 📖 How to Use

### 1. Connect Your Wallet

Click **"Connect Freighter"** in the header and approve the connection in the Freighter popup.

### 2. Send a GratitudeLine

Fill out the composer form:
- **Recipient Address**: Stellar public key (G...)
- **Tip Amount**: XLM amount (e.g., 2.00)
- **Your Name** (optional): Display name for sender
- **Recipient Name** (optional): Display name for recipient
- **Message**: Your thank-you message (10-140 characters)

Click **"Send GratitudeLine"** and approve the transaction in Freighter.

### 3. View the Gratitude Wall

Browse all GratitudeLines in the feed. Use filters to see:
- **All GratitudeLines**: Complete public feed
- **Sent by me**: Only your sent tips
- **To my address**: Tips you've received

### 4. Share a Receipt

Click any GratitudeLine to open its receipt. Copy the URL (e.g., `/g/<txHash>`) to share proof of your thank-you tip!

## 🏗️ Project Structure

```
L1/
├── app/
│   ├── g/[hash]/          # Dynamic receipt pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main landing page
├── components/
│   ├── GratitudeCard.tsx      # Individual GratitudeLine card
│   ├── GratitudeComposer.tsx  # Send form with transaction logic
│   ├── GratitudeReceipt.tsx   # Receipt modal
│   ├── GratitudeWall.tsx      # Public feed with filters
│   ├── Header.tsx             # App header with wallet connection
│   └── WalletCard.tsx         # Balance display
├── context/
│   ├── GratitudeContext.tsx   # GratitudeLines state management
│   └── WalletContext.tsx      # Wallet state management
├── lib/
│   ├── freighter.ts       # Freighter API integration
│   ├── stellar.ts         # Stellar SDK utilities
│   └── storage.ts         # localStorage utilities
├── types/
│   └── gratitude.ts       # TypeScript interfaces
└── docs/
    ├── prd.md             # Product Requirements Document
    └── user.md            # User Flow Documentation
```

## 🌐 Live Demo

**[View Live Demo](https://your-deployment-url.vercel.app)** *(Deploy to Vercel/Netlify)*

## 📸 Screenshots

### Connected Wallet with Balance
![Wallet Connected](./screenshots/wallet-connected.png)

### GratitudeLine Composer
![Composer](./screenshots/composer.png)

### Gratitude Wall
![Wall](./screenshots/gratitude-wall.png)

### Transaction Hash & Explorer Link
![Transaction](./screenshots/transaction-success.png)

## ✅ White Belt Level 1 Requirements

All requirements met:

- ✅ **Wallet Connection**: Connect/disconnect Freighter on Stellar Testnet
- ✅ **Balance Display**: Fetch and display XLM balance from Horizon
- ✅ **XLM Transaction**: Send native XLM payments on Testnet
- ✅ **Transaction Feedback**: Display transaction hash with explorer link
- ✅ **Public Repository**: GitHub repo with 5+ meaningful commits
- ✅ **Complete README**: Setup instructions, features, tech stack
- ✅ **Live Demo**: Deployed with HTTPS (Vercel/Netlify)
- ✅ **Screenshots**: All key features documented

## 🔒 Security Notes

- **No private keys** are handled by this dApp - all key management via Freighter
- **Testnet only** - This app is for learning purposes and uses test funds
- **Client-side storage** - GratitudeLines stored in browser localStorage
- **No backend** - All transactions submitted directly to Horizon Testnet

## 🚧 Future Enhancements (Beyond White Belt)

- Backend API for persistent GratitudeLines storage
- Real-time updates via WebSocket
- Social features (likes, comments)
- Mainnet support (with proper warnings)
- Custom token support
- NFT receipts for GratitudeLines

## 📝 License

MIT License - Built for educational purposes as part of the Stellar White Belt challenge.

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org/) for the amazing blockchain platform
- [Freighter](https://www.freighter.app/) for the excellent wallet extension
- [RiseIn](https://www.risein.com/) for the Stellar Journey to Mastery program

---

**Built with 💚 for the Stellar White Belt Level 1 Challenge**
