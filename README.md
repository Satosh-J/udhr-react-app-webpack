# ✅ [Completed] UDHR NFT Minter(For human rights DAO)

This project contains the COMPLETED files for [HRDAO's nft minting page](https://...).
In which we connect your wallet to smart contract through your React dApp project by building an NFT Minter using Metamask and Web3.
And builds bundle.js that can be reused with other templates. In this project bundle.js is used with Webflow.

# 🪜 Installation
To use this minter, you'll need to do the following:

1. Run `npm install` to download the `node_modules` folder.
2. Edit src\util\interact.js file and here edit 'apiKey' and 'contractAddress'. 
   Here 'alchemyKey' is used as apiKey and u should replace this with your 'apiKey' u used to deploy your smart contract.
   And 'contractAddress' is address of deployed smart contract.
3. Create a `.env` file in the root directory this `nft-minter` by entering the following on your command line: `vim .env` and then add your [Alchemy API Key](https://docs.alchemyapi.io/alchemy/tutorials/nft-minter#create-your-alchemy-api-key) and [Pinata Key and Secret](https://pinata.cloud/keys). Altogether, your `.env` file should look like so:

```
REACT_APP_PINATA_KEY = <pinata-key>
REACT_APP_PINATA_SECRET = <pinata-secret>
REACT_APP_ALCHEMY_KEY = https://eth-ropsten.alchemyapi.io/v2/<alchemy-key>
```
4. Run `npm start`in your terminal to open the minter in your browser at http://localhost:3000/.
