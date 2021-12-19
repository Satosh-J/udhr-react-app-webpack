import './Button.css';
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";

const Minter = () => {
  const [walletAddress, setWallet] = useState("");
  const [wallet_status, setWalletStatus] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);

  useEffect(() => {
    fetchWallet();
    addWalletListener();
  }, []);

  async function fetchWallet() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setWalletStatus(status); 
  }
  
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setWalletStatus("👆🏽 Press this button to mint a new UDHRNFT.");
        } else {
          setWallet("");
          setWalletStatus("🦊 Connect to Metamask using the top button.");
        }
      });
    } else {
      setWalletStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
    setWalletStatus(walletResponse.status);
  };

  function eth2Wei(value){
    let weiAmount = value * 10**18;
    return weiAmount;
  }

  const onMintPressed = async () => {
    console.log("sd");
    const { success, status } = await mintNFT(eth2Wei(donationAmount));
    setWalletStatus(status);
    if (success) {
      console.log("success");
    }
  };

  return (<div>

      <button id="btn_connect"
      onClick={connectWalletPressed}
      disabled = {walletAddress.length}
      class = {walletAddress.length > 0 ? ("disabled") : ("enabled")}
      >
        {walletAddress.length > 0 ? (<span>👨 Connected</span>) : (<span>🤔 Connect Wallet</span>)}
      </button>

      <p style={{ color: "blue" }}>
        {wallet_status}
      </p>

      <input id="mint_amount"
        type="text"
        placeholder="Input amount of ether you want to donate. i.e 100"
        onChange={(e) => setDonationAmount(e.target.value)}
        value={donationAmount}
      />
      <p>ether</p>
      <button id="btn_mint"  onClick={onMintPressed} disabled = {!walletAddress.length}
      class = {walletAddress.length> 0 ? ("enabled") : ("disabled")}
      >
        💎 Mint NFT
      </button>
    </div>
  );
};
export default Minter;
