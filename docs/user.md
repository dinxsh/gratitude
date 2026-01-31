### gratitude – Descriptive User Flow

***

## 1. Landing and wallet connection

1. **Open the app**  
   - User visits the gratitude URL in a desktop browser.  
   - Hero section explains: “Send tiny XLM tips with public thank‑you notes on Stellar Testnet. Connect your wallet to start.” [risein](https://www.risein.com/bootcamps/stellar-journey-to-mastery-monthly-builder-challenges)

2. **Connect Freighter**  
   - User clicks “Connect Freighter” in the header.  
   - If Freighter is not installed, the app shows a prompt with a link to install it; otherwise Freighter opens its permission dialog. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter)
   - User confirms connection and makes sure Freighter is set to **Stellar Testnet**. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter/connect-testnet)

3. **Connected state**  
   - Header updates to show:
     - Truncated public key (e.g., `GABCD…XYZ1`).  
     - Badge “Network: Stellar Testnet (Demo funds only)”. [developers.stellar](https://developers.stellar.org/docs/networks)
   - A “Disconnect” button appears, which will clear wallet state and user‑specific views when clicked.  

***

## 2. Balance fetch and home dashboard

4. **Fetch XLM balance**  
   - After connection, gratitude calls Horizon Testnet via the Stellar SDK to load the account by the user’s public key using `Networks.TESTNET`. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/create-account)
   - While waiting, a wallet card shows a loading indicator and message “Fetching your XLM balance…”.  

5. **Display wallet overview**  
   - When the response arrives, the app reads the native XLM balance (`asset_type: native`) and displays:
     - Large “Available XLM (Testnet)” amount.  
     - Small text with the truncated address.  
   - If the account is unfunded, the card shows a warning and a short instruction: “Your account is not funded on Testnet. Use Freighter’s friendbot to get test XLM.” [rapidinnovation](https://www.rapidinnovation.io/post/how-to-build-a-stellar-app)

6. **Reveal main sections**  
   - Below the wallet card, the app displays two primary areas:
     - **Send GratitudeLine**: a composer form for sending a tip + message.  
     - **Gratitude Wall**: a scrolling list of recent gratitude.  

***

## 3. Composing and sending a GratitudeLine

7. **Open the composer**  
   - In the “Send GratitudeLine” panel, the user sees fields:
     - “Recipient address (G…)”  
     - “Tip amount (XLM)”  
     - “Your name (optional)”  
     - “Recipient name (optional)”  
     - “Message of gratitude” (required short text)  

8. **Fill in details**  
   - User pastes a friend’s Stellar Testnet address into the recipient field.  
   - Enters a small amount, e.g., `2 XLM`, ensuring it’s less than or equal to their available balance. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/create-account)
   - Types a message like: “Thanks for reviewing my hackathon code!”  
   - Optionally fills “Your name” and “Recipient name” for nicer display on the wall.  

9. **Validation**  
   - On clicking “Send GratitudeLine”, the app:
     - Checks that recipient address is non‑empty and structurally valid using the Stellar SDK (e.g., `Keypair.fromPublicKey`). [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments)
     - Ensures amount is positive and not greater than current balance.  
     - Ensures the message is present and within length limits.  
   - If anything fails, inline error text appears under the offending field.  

10. **Build and sign the payment**  
    - After validation, gratitude constructs a Stellar Testnet transaction with a single `payment` operation sending native XLM from the user to the recipient. [developers.stellar](https://developers.stellar.org/docs/build/guides/dapps/frontend-guide)
    - Freighter pops up, showing:
      - Source account, destination, amount, and that it’s on **Testnet**.  
    - User reviews and confirms/signs in Freighter. [docs.freighter](https://docs.freighter.app/docs/guide/usingfreighterwebapp/)

11. **Submit to Horizon and wait**  
    - The app sends the signed transaction XDR to Horizon Testnet.  
    - While waiting, the composer shows a subtle loading state like “Broadcasting your GratitudeLine…”. [rapidinnovation](https://www.rapidinnovation.io/post/how-to-build-a-stellar-app)

12. **Handle success**  
    - On success:
      - A green success banner appears: “GratitudeLine sent successfully!”.  
      - The transaction hash is displayed with a button “View on Testnet Explorer”. [developers.stellar](https://developers.stellar.org/docs/networks)
      - The app creates a GratitudeLine record in local state:
        - Hash, sender/recipient addresses, aliases, amount, message, local timestamp.  
      - The new GratitudeLine instantly appears at the top of the Gratitude Wall.  

13. **Handle failure**  
    - If Horizon or Freighter returns an error (e.g., user rejected, insufficient funds, bad address), the composer shows a red error banner with a readable explanation.  
    - The form keeps the user’s inputs so they can fix and retry.  

***

## 4. Browsing the Gratitude Wall

14. **View public feed**  
    - In the “Gratitude Wall” section, the user sees a list of gratitude, each card showing:
      - “Alice → Bob · 2 XLM” (using aliases or truncated addresses).  
      - The gratitude message text.  
      - Time sent (“2 min ago”).  
      - “View tx” link opening the corresponding transaction in a Testnet explorer. [developers.stellar](https://developers.stellar.org/docs/build/guides/transactions/send-and-receive-payments)

15. **Filter for personal activity (optional)**  
    - If implemented, filter controls at the top allow the user to switch:
      - “All gratitude” – full public feed (local/session‑based for v1).  
      - “Sent by me” – only records where `senderPk` = connected wallet.  
      - “To my address” – records where `recipientPk` = connected wallet.  

***

## 5. Viewing a single GratitudeLine (receipt view)

16. **Open detail view**  
    - User clicks “Details” or the message card, or follows a shared link like `/g/<txHash>`.  

17. **Verify on‑chain and show metadata**  
    - The app queries Horizon Testnet for that `txHash` to confirm it exists and succeeded. [rapidinnovation](https://www.rapidinnovation.io/post/how-to-build-a-stellar-app)
    - It then:
      - Shows “GratitudeLine Receipt” with:
        - Sender alias/address, recipient alias/address.  
        - Exact amount in XLM.  
        - Message text.  
        - Transaction hash and a “View on Explorer” button.  
      - Uses the Horizon status to show “Confirmed on Stellar Testnet” or an error if the tx can’t be found.  

18. **Share the link**  
    - From this page, user can copy the URL and share it (e.g., in chat) to prove a specific tip and thank‑you message happened on‑chain.  

***

## 6. Disconnect and end of session

19. **Disconnect wallet**  
    - When the user is done, they click “Disconnect” in the header.  
    - gratitude:
      - Clears the stored public key and balance.  
      - Hides user‑specific filters like “Sent by me / To me”.  
      - Returns to the initial “Connect Freighter to start sending gratitude” state.  

20. **Return visit**  
    - On a future visit, if Freighter is still connected, the app can re‑hydrate the session by checking connection status and refetching the balance and “My gratitude,” allowing users to quickly continue sending or reviewing tips. [developers.stellar](https://developers.stellar.org/docs/build/guides/freighter)

This user flow keeps every critical White Belt requirement front and center—wallet connect/disconnect, balance, XLM testnet payments, and transaction hashes—while presenting them through a distinctive, social “thank‑you” experience.