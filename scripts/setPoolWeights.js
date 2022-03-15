require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const deployments = hre.deployments;

// configure relative weights for emissions of tokens (NOTE: ORDER MATTERS!)
const POOL_WEIGHTS = {
  team: 0, //1600,
  preSeed: 0, //1000,
  dao: 1000,
  tic: 1600, // single side
  lp: 4800, // lp tokens
};
    
/**
 * Script to set pool weights
 */
async function main () {
  accounts = await ethers.getSigners();

  const StakingPools = await deployments.get("StakingPools");
  const stakingPools = new ethers.Contract(
    StakingPools.address,
    StakingPools.abi,
    accounts[0]
  );
  // 2. Set weights for tokens
  console.log(`Setting pool weights: ${JSON.stringify(POOL_WEIGHTS)}`);
  await stakingPools.setRewardWeights(Object.values(POOL_WEIGHTS), {
    gasLimit: 400000,
  });
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });    
    