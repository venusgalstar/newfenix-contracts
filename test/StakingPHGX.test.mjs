// StakingPHGX.test.js
import { expect } from "chai";

describe("StakingPHGX", function () {
  let StakingPHGX;
  let stakingPHGX;
  let PHGX;
  let pHGX;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    console.log("owner address: ", owner.address);
    console.log("addr1 address: ", addr1.address);

    // Deploy the PHGX token contract
    PHGX = await ethers.getContractFactory("PHGX"); // Replace with your actual ERC20 token contract
    pHGX = await PHGX.deploy(ethers.utils.parseEther("300000"));
    console.log("PHGX address:", pHGX.address);

    // Deploy the StakingPHGX contract
    StakingPHGX = await ethers.getContractFactory("StakingPHGX");
    stakingPHGX = await StakingPHGX.deploy(pHGX.address);
    console.log("StakingPHGX address:", stakingPHGX.address);

    // Mint some test tokens to the owner for testing
    await pHGX.transfer(owner.address, ethers.utils.parseEther("100000")); // Mint 100000 PHGXs for testing
    await pHGX.transfer(addr1.address, ethers.utils.parseEther("100000"));
    await pHGX.transfer(stakingPHGX.address, ethers.utils.parseEther("100000"));
  });

  it("Should deploy with correct parameters", async function () {
    expect(await stakingPHGX.token()).to.equal(pHGX.address);
    expect(await stakingPHGX.owner()).to.equal(owner.address);
  });

  it("Should allow adding and removing plans", async function () {
    await stakingPHGX.addPlan(10, 300, ethers.utils.parseEther("1000")); // 10% reward for 5 minutes
    expect(await stakingPHGX.planCount()).to.eql(ethers.BigNumber.from(1));
  });

  it("Should allow staking and unstaking", async function () {
    await stakingPHGX.addPlan(10, 300, ethers.utils.parseEther("1000")); // 10% reward for 5 minutes

    // Connect addr1 to the PHGX contract
    const phgx = pHGX.connect(addr1);

    // Approve the staking contract to spend 1000 tokens
    await phgx.approve(stakingPHGX.address, ethers.utils.parseEther("1000"));

    // Connect addr1 to the StakingPHGX contract
    const staker1 = stakingPHGX.connect(addr1);

    // Stake 100 tokens with plan ID 0
    await staker1.stake(ethers.utils.parseEther("1000"), 0);

    // Check staker details
    const stakerInfo = await stakingPHGX.stakers(addr1.address);
    console.log(`${addr1.address} stackerInfo: `, stakerInfo);
    expect(stakerInfo.amount).to.eql(ethers.utils.parseEther("1000"));
    expect(stakerInfo.planId).to.eql(ethers.BigNumber.from(0));
    
    // Check staked balance
    // expect(await stakingPHGX.stakedBalance(addr1.address)).to.eql(ethers.utils.parseEther("1000"));

    // Check unlocking time
    // const unlockingTime = await stakingPHGX.unlockingTime(addr1.address);
    // console.log(`${addr1.address} unlockingTime: `, unlockingTime);

    // Wait for the unlock period
    await network.provider.send("evm_increaseTime", [300]); // Increase time by 5 minutes

    // Unstake
    await staker1.unstake();

    // Check staked balance after unstaking
    expect(await stakingPHGX.stakedBalance(addr1.address)).to.eql(ethers.BigNumber.from(0));
  });
});
