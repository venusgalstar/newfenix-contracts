const { ethers } = require("hardhat");

async function main() {
  const StakingPHGX = await ethers.getContractFactory("StakingPHGX");
  const stakingPHGX = await StakingPHGX.deploy(process.env.TOKEN_CONTRACT_ADDRESS);

  await stakingPHGX.deployed();

  console.log("StakingPHGX contract deployed to:", stakingPHGX.address);
  console.log("Transaction hash:", stakingPHGX.deployTransaction.hash);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});