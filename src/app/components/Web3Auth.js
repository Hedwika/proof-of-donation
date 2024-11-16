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
          clientId: "BAg5ZPP0wmZTxIrMaZEOsBmV9BuxCfjQMGzix3PDFbNgim26MQoVFVw-w51-kDYIDhrFXhQ9217ddrDFUV-kWe4",
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        // Configure MetaMask adapter
        const metamaskAdapter = new MetamaskAdapter({
          clientId: "BAg5ZPP0wmZTxIrMaZEOsBmV9BuxCfjQMGzix3PDFbNgim26MQoVFVw-w51-kDYIDhrFXhQ9217ddrDFUV-kWe4",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13882", // Polygon Amoy Testnet
            rpcTarget: "https://polygon-amoy.g.alchemy.com/v2/_v_yp7rgLBs1cvtlXi8F3qJBK7E5qnym", // Your Alchemy URL
            displayName: "Polygon Amoy Testnet",
            ticker: "POL", // Ensure the currency symbol matches your network
            tickerName: "Polygon Amoy Testnet Token",
          },
        });
        

        // Add MetaMask adapter to Web3Auth
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
      if (!web3auth) {
        console.error("Web3Auth not initialized");
        return;
      }
  
      // Show the login modal and connect
      const web3authProvider = await web3auth.connect();
      if (!web3authProvider) {
        console.error("Web3Auth provider is undefined");
        return;
      }
  
      console.log("web3authProvider:", web3authProvider);
  
      // Initialize ethers provider
      const ethersProvider = new ethers.BrowserProvider(web3authProvider);
      console.log("ethersProvider initialized:", ethersProvider);
  
      // Get the signer
      const signer = await ethersProvider.getSigner();
      // Retrieve the address from the signer
      const address = await signer.getAddress();
      console.log("Connected Wallet Address:", address);
  
      // Fetch user information from Web3Auth
      const userInfo = await web3auth.getUserInfo();
      console.log("User Info:", userInfo);
  
      setUser({ ...userInfo, walletAddress: address }); // Save user info and wallet address
      setProvider(ethersProvider);
    } catch (error) {
      console.error("Login error:", error);
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

      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name || "User"}!</p>
          <p>Address: {user.walletAddress || "No address found"}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Web3Auth</button>
      )}
    </div>
  );  
};

export default Web3AuthComponent;