const { ethers } = require('ethers');
const tokenAbi = require('../const/tokenAbi.json');
const stakingContractAbi =  require('../const/stakingContractAbi.json');

async function addPlan(rewardRate, unlockPeriod, minimalAmount) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
  const signer = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY, provider);

  // Staking Smart Contract
  const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;
  const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);

  // Add plan
  const gasLimit = 200000; // default is 21000, must be higher than default to interact with smart contract!
  
  const stakeTx = await stakingContract.addPlan(rewardRate, unlockPeriod, minimalAmount, { gasLimit });
  const receipt = await stakeTx.wait();

  console.log('Added plan successfully - Transaction hash: ', receipt.transactionHash);
}

async function getPlan(planId) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
  const signer = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

  // Staking Smart Contract
  const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;
  const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);

  // Get plan by Id
  const plan = await stakingContract.plans(planId);

  console.log(`Plan[${planId}]: `, plan);
}

async function getUnlockingTime(staker_address) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
  const signer = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

  // Staking Smart Contract
  const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;
  const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);

  // Get plan by Id
  let unlockingTime = await stakingContract.unlockingTime(staker_address);
  unlockingTime = parseInt(unlockingTime.toString())

  console.log(`Stakder's unlocking time - ${staker_address} : `, unlockingTime);
}

async function stakeTokens(amount, planId) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
  const signer = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

  // ERC-20 Token
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

  // Staking Smart Contract
  const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;
  const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);

  // Set the allowance for the staking contract to spend your tokens
  const approvalTx = await tokenContract.approve(stakingContractAddress, ethers.utils.parseEther("100000"));
  await approvalTx.wait();

  // Stake your tokens
  const stakeTx = await stakingContract.stake(ethers.utils.parseEther(amount.toString()), planId);
  const receipt = await stakeTx.wait();

  console.log('Tokens staked successfully -  Transaction hash: ', receipt.transactionHash);
}

async function unstakeTokens() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
  const signer = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

  // Staking Smart Contract
  const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;
  const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);

  // Unstake your tokens
  const stakeTx = await stakingContract.unstake();
  const receipt = await stakeTx.wait();

  console.log('Tokens unstaked successfully -  Transaction hash: ', receipt.transactionHash);
}

// addPlan(10, 300, 1000)

// getPlan(0)

// getUnlockingTime(process.env.USER_WALLET_ADDRESS)

// stakeTokens(10000, 0)
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

// unstakeTokens()