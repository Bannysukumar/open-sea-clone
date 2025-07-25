const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy NFT contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);

  // Deploy Marketplace contract
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace contract deployed to:", marketplace.address);

  // Save contract addresses to a file for frontend use
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/contracts";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ NFT: nft.address, Marketplace: marketplace.address }, undefined, 2)
  );

  const artifact = artifacts.readArtifactSync("NFT");
  fs.writeFileSync(
    contractsDir + "/NFT.json",
    JSON.stringify(artifact, null, 2)
  );

  const marketplaceArtifact = artifacts.readArtifactSync("Marketplace");
  fs.writeFileSync(
    contractsDir + "/Marketplace.json",
    JSON.stringify(marketplaceArtifact, null, 2)
  );

  console.log("Contract addresses and artifacts saved to frontend/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 