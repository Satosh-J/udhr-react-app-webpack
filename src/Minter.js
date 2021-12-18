import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
  changeContractOwner,
  loadCurrenctOwner,
  loadMetadata,
  udhrContract,
  loadCurrenctTreasury
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [treasuryAddress, setTreasury] = useState("No connection to the network.");
  const [newTreasury, setNewTreasury] = useState("");
  const [owner, setOwner] = useState("No connection to the network.");
  const [newOwner, setNewOwner] = useState("");
  const [status, setStatus] = useState("");

  const [donorLevel, setDonorLevel] = useState("Genesis NFT");
  const [issuanceNum, setIssuanceNum] = useState(0);

  const [tokenId, setTokenId] = useState(0);
  const [donationAmount, setDonationAmount] = useState(0);

  useEffect(() => {
    fetchWallet();
    fetchOwner();
    fetchTreasury();
    addSmartContractListener()
    addWalletListener();
  }, []);

  async function fetchOwner() {
    const owner = await loadCurrenctOwner();
    setOwner(owner);
  }

  async function fetchTreasury() {
    const curTreasury = await loadCurrenctTreasury();
    setTreasury(curTreasury);
  }

  async function fetchMeta() {
    const metadata = await loadMetadata(tokenId);
    setDonorLevel(metadata.donorLevel);
    setIssuanceNum(metadata.issNumber);
  }

  async function fetchWallet() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status); 
  }
  
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Press this button to mint a new UDHRNFT.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
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
    setStatus(walletResponse.status);
  };

  const onChangeOwnerPressed = async () => {
    const {status} = await changeContractOwner(walletAddress, newOwner);
    setOwner(status);
  };

  const getMetadataPressed = () => {
     fetchMeta(tokenId);
  };

  function eth2Wei(value){
    let weiAmount = value * 10**18;
    return weiAmount;
  }

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(eth2Wei(donationAmount));
    setStatus(status);
    if (success) {
      console.log("success");
    }
  };

  function addSmartContractListener() {
    udhrContract.events.TreasuryWalletChanged({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setTreasury(data.returnValues[1]);
        setNewTreasury("");
        setStatus("🎉 Your message has been updated!");
      }
    });
  }

  return (
    <div className="Minter">
      <Button id="walletButton" variant="outline-success" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>
      <h1 id="title">🎁The UDHRNFT Minter🎁</h1>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
        <h2>Owner of smart contract:</h2>
        <p>{owner}</p>
        {/* Change treasury button. */}
        <input
          type="text"
          placeholder="Input your new wallet address."
          onChange={(e) => setNewOwner(e.target.value)}
          value={newOwner}
        />
        <button id="change_owner_btn" class="blue_button" onClick={onChangeOwnerPressed}>
          Change Contract Owner
        </button>

        <h2>Current Treasury:</h2>
        <p>{treasuryAddress}</p>
        <h2>New Treasury:</h2>
        <input
          type="text"
          placeholder="Input your new wallet address."
          onChange={(e) => setNewTreasury(e.target.value)}
          value={newTreasury}
        />
        <h2>Donation Level:</h2>
        <p>{donorLevel}</p>
        <h2>Issuance Number:</h2>
        <p>{issuanceNum}</p>
        <h2>✌ Token Id ✌</h2>

        <input
          type="text"
          placeholder="Input tokenId you want to get metadata. i.e 99"
          onChange={(e) => setTokenId(e.target.value)}
          value={tokenId}
        />
        <button id="getMeta" type="button" class="blue_button" onClick={getMetadataPressed}>
          Get MetaData
        </button>

        {/* Minting button with Minting amount. */}
        <h2>Donation Amount:</h2>
        <input
          type="text"
          placeholder="Input amount of ether you want to donate. i.e 100"
          onChange={(e) => setDonationAmount(e.target.value)}
          value={donationAmount}
        />
        <button id="mintButton" class="blue_button" onClick={onMintPressed}>
          Mint NFT
        </button>
    </div>
  );
};

export default Minter;
