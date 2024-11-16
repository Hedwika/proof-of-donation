require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20", // Ensure Solidity version matches your contracts
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimization setting
      },
    },
  },
  networks: {
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/_v_yp7rgLBs1cvtlXi8F3qJBK7E5qnym", // Amoy Testnet URL
      accounts: ['0xee2e38ea98522431daad4679c0266e878e630065a662ddd1bc984be26325a3bb'],
    },
  },
};
