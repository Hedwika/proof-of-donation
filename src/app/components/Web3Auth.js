"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const database = {
  data: [
    {
      address: "0x1e240B45eEb3FAc59F1F12b77319261089996020",
      supported_project: "eff",
      eligible: true,
      claimed: false,
    },
    {
      address: "0x81d9EC6948aa76e38ADfAd9AD92676E64f278085",
      supported_project: "tor",
      eligible: true,
      claimed: false,
    },
  ],
};

const Web3AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3auth, setWeb3Auth] = useState(null);
  const [eligibilityInfo, setEligibilityInfo] = useState(null); // Track eligibility and project info
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x4f6537f71fe671b68268c4ae9f989b279d46563d"; // Replace with your deployed contract address
  const contractABI = [
    "function mintNFT(address recipient, string memory tokenURI, uint256 collectionId) public",
    "function createCollection(uint256 collectionId, string memory collectionName) public",
    "function getCollection(uint256 collectionId) public view returns (string memory collectionName, uint256[] memory tokenIds)",
  ];

  const metadataMap = {
    eff: "ipfs://QmU19jnynsN9s2VrzXSgzJSCYWt14vtcZkUKkHeKvfwLEk/metadata.json",
    tor: "ipfs://QmXdG6Tf3Ci2Zp8qrkFoHDNAABoVYLhhvnkke9h8t5ZUTE/metadata.json",
  };

  const collectionIds = {
    eff: 1,
    tor: 2,
  };

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
          clientId: "BAg5ZPP0wmZTxIrMaZEOsBmV9BuxCfjQMGzix3PDFbNgim26MQoVFVw-w51-kDYIDhrFXhQ9217ddrDFUV-kWe4", // Replace with your client ID
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

      // Require signature for verification
      const message = `Welcome! Please sign this message to verify your identity.\n\nAddress: ${address}`;
      const signature = await signer.signMessage(message);

      console.log("Signature:", signature);

      const userInfo = await web3auth.getUserInfo();
      setUser({ ...userInfo, walletAddress: address });
      setProvider(ethersProvider);

      // Check eligibility in database
      const userEligibility = database.data.find((entry) => entry.address === address);

      if (userEligibility && userEligibility.eligible && !userEligibility.claimed) {
        setEligibilityInfo(userEligibility);
      } else {
        setEligibilityInfo(null);
      }
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
      setEligibilityInfo(null);
      setSuccessMessage(null); // Reset success message on logout
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mintNFT = async () => {
    if (!provider || !user || !eligibilityInfo) {
      console.error("Missing required data for minting");
      return;
    }

    try {
      setLoading(true);
      console.log("Minting NFT...");

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const collectionId = collectionIds[eligibilityInfo.supported_project];
      const metadataURL = metadataMap[eligibilityInfo.supported_project];

      const mintTx = await contract.mintNFT(user.walletAddress, metadataURL, collectionId);
      console.log("Minting transaction sent:", mintTx.hash);
      await mintTx.wait();
      console.log("NFT minted successfully!");

      setSuccessMessage(`Your ${eligibilityInfo.supported_project.toUpperCase()} donor badge was minted successfully!`);
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center text-gray-900">
      {user ? (
        <>
          <p className="font-semibold">Welcome, {user.name || "User"}!</p>
          <p className="font-medium">Address: {user.walletAddress || "No address found"}</p>
          {successMessage ? (
            <p className="font-semibold">{successMessage}</p>
          ) : eligibilityInfo ? (
            <>
              <p>
                You are eligible to mint a donor badge for the project:{" "}
                <b>{eligibilityInfo.supported_project.toUpperCase()}</b>
              </p>
              <button
                className={`rounded px-4 py-2 text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
                }`}
                onClick={mintNFT}
                disabled={loading}
              >
                {loading ? "Minting..." : "Mint!"}
              </button>
            </>
          ) : (
            <p>You are not eligible to mint a proof of donation.</p>
          )}
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Web3Auth"}
        </button>
      )}
    </div>
  );
};

export default Web3AuthComponent;
