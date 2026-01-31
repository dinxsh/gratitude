**Product Requirements Document – gratitude (Stellar White Belt Level 1)**  

***

## 1. Product overview

gratitude is a social tipping dApp on Stellar Testnet where users send tiny XLM “thank‑you tips” paired with short public thank‑you notes. Each tip becomes a **GratitudeLine**: a visible message of appreciation linked to a real Stellar transaction hash and viewable on a shared “Gratitude Wall.” This wraps the mandatory wallet, balance, and payment flows in an emotional, social product experience instead of a generic payment form. [gitcoin](https://gitcoin.co/blog/introducing-kudos)

***

## 2. Objectives and scope

**Objectives**

- Provide a simple way to send on‑chain XLM tips on Stellar Testnet, with clear transaction feedback and hashes. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)
- Add a product layer of **public gratitude messages**, turning raw payments into recognizable social signals similar to kudos/recognition systems on other ecosystems. [cuddleofdeath.hashnode](https://cuddleofdeath.hashnode.dev/proof-of-knowledge-lets-talk-about-kudos)
- Fully satisfy White Belt Level 1 requirements: wallet setup/connection, balance display, XLM transaction on testnet, and visible transaction result, plus a deployed app and public GitHub repo. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)

**In scope**

- Freighter wallet on Stellar Testnet (connect/disconnect, signing). [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter/connect-testnet)
- XLM (native asset) balance fetch using Horizon Testnet and Stellar SDK. [developers.stellar](https://developers.stellar.org/docs/build/guides/dapps/frontend-guide)
- Sending standard XLM payments from connected wallet to any Stellar address on Testnet. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments)
- Associating each successful payment with:
  - Sender alias (optional),  
  - Recipient alias (optional),  
  - Short text message,  
  - Amount and timestamp,  
  - Transaction hash + explorer link.  
- Displaying these as cards in a “Gratitude Wall” UI.  

**Out of scope**

- Smart contracts, NFTs, custom tokens, or mainnet support. [dev](https://dev.to/kartik_chinda_682309be748/start-with-stellar-the-only-tutorial-you-need-to-build-a-full-stack-dapp-from-scratch-3k26)
- On‑chain storage of messages (all gratitude text is off‑chain, keyed by tx hash).  
- Complex economic or referral logic like multi‑level distributions.  

***

## 3. Target users and use cases

**Target users**

- Web3 developers and contributors who want to send visible, verifiable “thank‑you” tips to peers on Testnet (e.g., after code reviews, mentorship, or hackathon help). [dev](https://dev.to/bobcars/exploring-gitcoin-kudos-strengthening-the-open-source-community-11cj)
- Participants in the Stellar White Belt challenge wanting a product with strong UX storytelling rather than a bare payment demo. [developers.stellar](https://developers.stellar.org/docs/build/guides/dapps/frontend-guide)

**Primary use cases**

1. **Send a GratitudeLine (tip + note)**  
   - A developer wants to thank a friend for pair‑programming help by sending 2 XLM with a short public message.  

2. **Show proof of appreciation**  
   - A recipient opens a unique receipt URL or the wall to show that a specific thank‑you payment exists on Stellar Testnet, with an explorer link for verification.  

3. **Browse recent gratitude in the community**  
   - Any user opens gratitude, sees a feed of recent tips and messages, and can click through to the underlying transactions on Testnet.  

4. **Personal history**  
   - A connected user filters the wall to “Sent by me” or “To my address” to view their own appreciation history.  

***

## 4. Core features and functional requirements

### 4.1 Wallet connection and network

**Requirements**

- Use Freighter for wallet management and transaction signing. [docs.trustlesswork](https://docs.trustlesswork.com/trustless-work/stellar-and-soroban-the-backbone-of-trustless-work/stellar-wallets/freighter-wallet)
- Support **connect** and **disconnect** from the UI:
  - “Connect Freighter” button triggers Freighter’s permission flow for the dApp on Stellar Testnet. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter/connect-testnet)
  - “Disconnect” clears local wallet state and hides user‑specific features (balance, “My gratitude”).  

**Behavior**

- After connection, show truncated public key and a visible “Testnet” badge (e.g., “Network: Stellar Testnet”) to avoid confusion with mainnet. [developers.stellar](https://developers.stellar.org/docs/networks)
- On initial load, check if the user is already connected in Freighter and auto‑hydrate the public key if possible.  

### 4.2 Balance handling

**Requirements**

- After successful wallet connection, call Horizon Testnet using `@stellar/stellar-sdk` with `Networks.TESTNET` to load the account. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/create-account)
- Extract the native XLM balance and display it clearly.  

**UI**

- Wallet card shows:
  - “Available XLM (Testnet)” in big typography.  
  - Public key snippet and network label.  
  - Loading state while fetching and a human‑readable error if account is unfunded or the network call fails, with guidance to fund via Freighter’s friendbot or official testnet faucets. [rapidinnovation](https://www.rapidinnovation.io/post/how-to-build-a-stellar-app)

### 4.3 Create and send a GratitudeLine

**Requirements**

- GratitudeLine composer form with fields:
  - Recipient public key (G‑address).  
  - Tip amount (XLM).  
  - Optional sender display name (alias).  
  - Optional recipient display name.  
  - Required short message (e.g., 10–140 characters).  

- Form + validation:
  - All required fields must be present; validate address using Stellar SDK utilities, ensure amount is > 0 and <= balance. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments)
  - Show inline validation errors.  

**Transaction handling**

- On submit:
  - Build a Stellar transaction on **Testnet** with one `payment` operation (native XLM) from the connected wallet to the recipient. [developers.stellar](https://developers.stellar.org/docs/build/guides/dapps/frontend-guide)
  - Request signature via Freighter; user sees the tx details and confirms in the extension. [docs.freighter](https://docs.freighter.app/docs/guide/usingfreighterwebapp/)
  - Submit the signed transaction XDR to Horizon Testnet and handle the response. [rapidinnovation](https://www.rapidinnovation.io/post/how-to-build-a-stellar-app)

**Feedback**

- On success:
  - Show success toast/banner with:
    - “GratitudeLine sent!”  
    - Transaction hash.  
    - “View on Explorer” link using a known Stellar Testnet explorer.  
  - Create a **GratitudeLine object** in local store keyed by tx hash:
    - `hash`, `senderPk`, `recipientPk`, `senderAlias`, `recipientAlias`, `message`, `amount`, `timestamp`.  
  - Append it to the Gratitude Wall and to the sender’s “My gratitude” list.  

- On failure:
  - Show error banner with a friendly message (e.g., “User rejected in Freighter”, “Insufficient funds”, or “Invalid destination address”).  

### 4.4 Gratitude Wall (public feed)

**Requirements**

- A “Gratitude Wall” section that lists recent gratitude with:
  - Sender alias (or truncated address) → recipient alias (or truncated address).  
  - Tip amount in XLM.  
  - Message text.  
  - Time sent (approximate from local timestamp).  
  - “View tx” link going to the Testnet explorer page for that hash. [developers.stellar](https://developers.stellar.org/docs/networks)

**Display rules**

- Newest gratitude appear at the top.  
- If there is no data (fresh deployment), show an empty state explaining how it will look once people start sending tips.  

**Optional enhancements (still client‑side)**

- Local filter controls:
  - “All gratitude”  
  - “Sent by me” (filter by `senderPk` = connected wallet).  
  - “To my address” (filter by `recipientPk` = connected wallet).  

### 4.5 Receipt / shareable view

**Requirements**

- Each GratitudeLine can be opened on a detail page (or modal) via a route like `/g/<txHash>`.  

**Behavior**

- On page open:
  - Call Horizon Testnet to confirm the transaction exists and was successful. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments)
  - Match the hash to any stored metadata (sender/recipient aliases, message, amount, timestamp).  
- Show:
  - “GratitudeLine Receipt” title.  
  - Message, amount, sender, recipient.  
  - On‑chain confirmation: tx hash + explorer link, status derived from Horizon.  

This acts as a proof‑of‑gratitude link that users can share with others.  

***

## 5. UX / UI requirements

**Layout**

- Single‑page app with:
  - Header: logo/name “gratitude”, wallet connection status.  
  - Left/top: Wallet card (balance + address + network).  
  - Main: two tabs or sections:
    - “Send GratitudeLine” composer.  
    - “Gratitude Wall” feed.  

**Style**

- Modern, minimal design with soft accent colors (e.g., green for positive feedback) to emphasize appreciation. [developers.stellar](https://developers.stellar.org/docs/build/guides/dapps/frontend-guide)
- Responsive layout for desktop first, reasonable mobile support.  

**Copy and tone**

- Friendly, non‑financial tone:
  - Buttons like “Send GratitudeLine” instead of “Send Payment”.  
  - Sub‑copy: “Tiny XLM tips with big thank‑you messages on Stellar Testnet.”  
- Clear “Testnet only” disclaimer and note that everything is for learning/demo purposes. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)

***

## 6. Technical requirements

**Tech stack**

- Frontend: React/Next.js with Tailwind CSS (or similar) following Stellar’s frontend guide. [dev](https://dev.to/kartik_chinda_682309be748/start-with-stellar-the-only-tutorial-you-need-to-build-a-full-stack-dapp-from-scratch-3k26)
- Stellar SDK: `@stellar/stellar-sdk` for Horizon queries and transaction construction. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/create-account)
- Wallet: `@stellar/freighter-api` for connect/disconnect and signing. [docs.freighter](https://docs.freighter.app/docs/guide/usingFreighterWebApp)

**Network**

- Horizon endpoint: `https://horizon-testnet.stellar.org`.  
- Network passphrase: `Networks.TESTNET` constant from the SDK. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/create-account)

**Data**

- gratitude can be stored client‑side (e.g., in memory or localStorage) for this level.  
- No backend is required; the minimal viable product can show only gratitude sent from this browser session plus any dummy seeded examples.  

**Security**

- No private keys handled in the dApp; all key management and signing via Freighter. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter)
- Do not store sensitive data besides public keys and short messages.  
- Gracefully handle missing Freighter (show “Install Freighter to get started”).  

***

## 7. GitHub, deployment, and submission

**Repository**

- Public GitHub repository named e.g. `gratitude-stellar-whitebelt`.  
- At least 5 meaningful commits, e.g.:
  1. Project scaffold + basic UI structure.  
  2. Freighter integration: connect/disconnect + wallet card.  
  3. Balance fetch and display via Horizon Testnet.  
  4. Payment (GratitudeLine) flow + tx feedback.  
  5. Gratitude Wall UI, filters, README, screenshots, deployment fixes. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)

**README**

- Sections:
  - Product description: what gratitude is and why it exists.  
  - Features: wallet connect, balance, send gratitude, wall, tx hashes.  
  - Tech stack and Stellar details (Testnet only).  
  - Setup instructions:
    - Clone, install deps, run dev server.  
    - Install Freighter and switch to Testnet; fund via friendbot/testnet faucet. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter/connect-testnet)
  - Live demo link (Vercel/Netlify).  
  - Screenshots:
    - Wallet connected + balance.  
    - GratitudeLine composer.  
    - Gratitude Wall with at least one successful tip and visible tx hash/feedback.  

**Deployment**

- Deploy to Vercel or Netlify with HTTPS so Freighter works smoothly in the browser. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter/connect-testnet)

***

## 8. Acceptance criteria

- User can connect and disconnect Freighter on Stellar Testnet from the app header. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)
- Connected wallet’s XLM balance is fetched from Horizon Testnet and displayed accurately.  
- User can send at least one XLM payment on Testnet via the GratitudeLine composer.  
- After each send, the UI shows:
  - Success or failure state.  
  - Transaction hash with a working explorer link.  
- Successful tips appear on the Gratitude Wall with message, sender/recipient info, amount, and tx hash.  
- Public GitHub repo, ≥5 meaningful commits, complete README, live demo link, and screenshots meeting the White Belt checklist are available. [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)