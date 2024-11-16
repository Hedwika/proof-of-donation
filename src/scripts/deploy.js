const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ProofOfDonationNFT = await hre.ethers.getContractFactory("ProofOfDonationNFT");
  const proofOfDonationNFT = await ProofOfDonationNFT.deploy(deployer.address); // Pass deployer's address as the owner

  await proofOfDonationNFT.deployed();

  console.log("ProofOfDonationNFT deployed to:", proofOfDonationNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });