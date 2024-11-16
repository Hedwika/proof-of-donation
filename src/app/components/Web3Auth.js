"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const Web3AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3auth, setWeb3Auth] = useState(null);
  const [eligible, setEligible] = useState(null);
  const [loading, setLoading] = useState(false);

  const contractAddress = "0xa8c6076a869EFcCABd2145bB28AEA05BbBD48A0d"; // Replace with your deployed contract address
  const contractABI = [
    "function mintNFT(address recipient, string memory tokenURI) public",
  ];

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: "eip155",
              chainId: "0x13882",
              rpcTarget: "https://polygon-amoy.g.alchemy.com/v2/_v_yp7rgLBs1cvtlXi8F3qJBK7E5qnym",
              displayName: "Polygon Amoy Testnet",
              blockExplorer: "https://amoy.polygonscan.com/",
              ticker: "POL",
              tickerName: "POL",
            },
          },
        });

        const web3authInstance = new Web3Auth({
          clientId: "BAg5ZPP0wmZTxIrMaZEOsBmV9BuxCfjQMGzix3PDFbNgim26MQoVFVw-w51-kDYIDhrFXhQ9217ddrDFUV-kWe4", // Replace with your client ID
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        const metamaskAdapter = new MetamaskAdapter({
          clientId: "BAg5ZPP0wmZTxIrMaZEOsBmV9BuxCfjQMGzix3PDFbNgim26MQoVFVw-w51-kDYIDhrFXhQ9217ddrDFUV-kWe4",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13882",
            rpcTarget: "https://polygon-amoy.g.alchemy.com/v2/_v_yp7rgLBs1cvtlXi8F3qJBK7E5qnym",
            displayName: "Polygon Amoy Testnet",
            ticker: "POL",
            tickerName: "Polygon Amoy Testnet Token",
          },
        });

        web3authInstance.configureAdapter(metamaskAdapter);
        setWeb3Auth(web3authInstance);
        await web3authInstance.initModal();
        console.log("Web3Auth initialized successfully");
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      if (!web3auth) {
        console.error("Web3Auth not initialized");
        return;
      }

      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.BrowserProvider(web3authProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();

      const userInfo = await web3auth.getUserInfo();
      setUser({ ...userInfo, walletAddress: address });
      setProvider(ethersProvider);

      // Simulate eligibility check
      setEligible(true); // Replace with actual backend eligibility check
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!web3auth) {
        console.error("Web3Auth not initialized");
        return;
      }

      await web3auth.logout();
      setUser(null);
      setProvider(null);
      setEligible(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mintNFT = async () => {
    if (!provider || !user) {
      console.error("No provider or user logged in");
      return;
    }

    try {
      setLoading(true);
      console.log("Minting NFT...");

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const metadataURL = "ipfs://QmU19jnynsN9s2VrzXSgzJSCYWt14vtcZkUKkHeKvfwLEk/metadata.json";
      const transaction = await contract.mintNFT(user.walletAddress, metadataURL);

      console.log("Transaction sent. Waiting for confirmation...");
      await transaction.wait();

      console.log("NFT minted successfully!");
      setEligible(false);
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {user ? (
        <div className="text-center">
          <p>Welcome, {user.name || "User"}!</p>
          <p>Address: {user.walletAddress || "No address found"}</p>
          <p>
            {eligible === null
              ? "Checking eligibility..."
              : eligible
              ? "You are eligible to mint the proof of donation."
              : "You are not eligible to mint the proof of donation."}
          </p>
          <button
            className={`rounded px-4 py-2 text-white ${
              eligible ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={mintNFT}
            disabled={!eligible || loading}
          >
            {loading ? "Minting..." : "Mint!"}
          </button>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Web3Auth"}
        </button>
      )}
    </div>
  );
};

export default Web3AuthComponent;
