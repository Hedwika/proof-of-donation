require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Compile and deploy the contract
  const ProofOfDonationNFT = await hre.ethers.getContractFactory("ProofOfDonationNFT");
  const proofOfDonationNFT = await ProofOfDonationNFT.deploy();

  console.log("Waiting for transaction to be mined...");
  await proofOfDonationNFT.deploymentTransaction().wait(); // Wait for the deployment transaction to be mined

  console.log("ProofOfDonationNFT deployed to:", proofOfDonationNFT.target || proofOfDonationNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });