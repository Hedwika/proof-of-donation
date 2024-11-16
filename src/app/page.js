"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3AuthComponent from "./components/Web3Auth";

const contractAddress = "0x4f6537f71fe671b68268c4ae9f989b279d46563d"; // Your deployed contract address
const contractABI = [
  "function getCollection(uint256 collectionId) public view returns (string memory collectionName, uint256[] memory tokenIds)",
];

export default function Home() {
  const [effSupporters, setEffSupporters] = useState(0);
  const [torSupporters, setTorSupporters] = useState(0);

  const fetchSupporterCounts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const effCollection = await contract.getCollection(1);
      setEffSupporters(effCollection[1].length);

      const torCollection = await contract.getCollection(2);
      setTorSupporters(torCollection[1].length);
    } catch (error) {
      console.error("Error fetching supporter counts:", error);
    }
  };

  useEffect(() => {
    fetchSupporterCounts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-10">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 drop-shadow-md">Proof of Donation</h1>
        <p className="text-lg text-gray-800 mt-2 drop-shadow-sm">
          Support and Get Your Digital Badge!
        </p>
      </header>

      {/* Main Section with Donation Options */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Support EFF */}
        <div className="text-center">
          <a
            href="https://www.eff.org/pages/donate-eff"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/eff-logo.png"
              alt="Support EFF"
              className="rounded-lg shadow-md hover:scale-105 transition-transform"
              width={200} // Reduced image size
              height={150}
            />
          </a>
          <p className="text-xl font-bold mt-4 text-gray-900">Support EFF</p>
          <p className="text-gray-700 text-lg">Supporters: {effSupporters}</p>
        </div>

        {/* Support TOR */}
        <div className="text-center">
          <a
            href="https://donate.torproject.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/tor-logo.png"
              alt="Support TOR"
              className="rounded-lg shadow-md hover:scale-105 transition-transform"
              width={200} // Reduced image size
              height={150}
            />
          </a>
          <p className="text-xl font-bold mt-4 text-gray-900">Support TOR</p>
          <p className="text-gray-700 text-lg">Supporters: {torSupporters}</p>
        </div>
      </main>

      {/* Web3AuthComponent Section */}
      <main className="flex flex-col items-center justify-center mt-10">
        <Web3AuthComponent />
      </main>

      {/* Footer Section */}
      <footer className="mt-12 text-center">
        <p className="text-gray-800 text-lg drop-shadow-sm">
          Built with ❤️ using <span className="font-bold">Next.js</span>,{" "}
          <span className="font-bold">Web3Auth</span>,{" "}
          <span className="font-bold">Nouns DAO</span>, and{" "}
          <span className="font-bold">Polygon</span>.
        </p>
      </footer>
    </div>
  );
}
