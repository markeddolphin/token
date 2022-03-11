require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const deployments = hre.deployments;


/**
 * Script to create pool for sushi
 */
async function main () {
  accounts = await ethers.getSigners();

  const StakingPools = await deployments.get("StakingPools");
  const stakingPools = new ethers.Contract(
    StakingPools.address,
    StakingPools.abi,
    accounts[0]
  );
  console.log(`Creating TIC Staking Pool for Sushi LP:${process.env.SUSHI_LP_ADDRESS}`);
  await stakingPools.createPool(process.env.SUSHI_LP_ADDRESS); 
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });