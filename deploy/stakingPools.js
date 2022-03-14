// avalanche testnet seems to have some state issues with nonces, this ensures those are resolved.
// unclear if we need this for mainnet, but it cannot hurt. 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin, governance } = namedAccounts;
  
  const poolLib = await deployments.get("Pool");
  const stakeLib = await deployments.get("Stake");
  const fixedPointMathLib = await deployments.get("FixedPointMath");
  const ticToken = await deployments.get("TicToken");
  const timeTokenDAO = await deployments.get("TimeTokenDAO");
  const timeTokenTeam = await deployments.get("TimeTokenTeam");
  const timeTokenPreSeed = await deployments.get("TimeTokenPreSeed");

  const deployResult = await deploy("StakingPools", {
    from: admin,
    contract: "StakingPools",
    args: [ ticToken.address, admin],
    libraries: {
      Pool: poolLib.address,
      Stake: stakeLib.address,
      FixedPointMath: fixedPointMathLib.address
    }
  });
  if (deployResult.newlyDeployed) {
    log(
      `StakingPools deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
    
    // 1. create pools for each token we have deployed.
    const accounts = await ethers.getSigners();
    const stakingPools = new ethers.Contract(
      deployResult.address,
      deployResult.abi,
      accounts[0]
    );
    const ticTokenContract = new ethers.Contract(
      ticToken.address,
      ticToken.abi,
      accounts[0]
    );
    log(`Creating pool for Time Token Team address:${timeTokenTeam.address}`);
    await stakingPools.createPool(timeTokenTeam.address);
    await sleep(10000);
   
    log(`Creating pool for Time Token PreSeed address:${timeTokenPreSeed.address}`);
    await stakingPools.createPool(timeTokenPreSeed.address);
    await sleep(10000);

    log(`Creating pool for Time Token DAO address:${timeTokenDAO.address}`);
    await stakingPools.createPool(timeTokenDAO.address);
    await sleep(10000);

    log(`Creating pool for TIC address:${ticToken.address}`);
    await stakingPools.createPool(ticToken.address);
    await sleep(10000);

    // 2. grant minter role to staking pool!
    const minterRole = await ticTokenContract.MINTER_ROLE();
    await ticTokenContract.grantRole(minterRole, stakingPools.address);
    await sleep(10000);

    // 3. set pending governance to DAO
    log(`Setting Pending Governance to : ${governance}`);
    await stakingPools.setPendingGovernance(governance);
  }
};
module.exports.tags = ["StakingPools"];
module.exports.dependencies = [
  "Pool", 
  "Stake", 
  "FixedPointMath", 
  "TicToken",
  "TimeTokenDAO",
  "TimeTokenTeam",
  "TimeTokenPreSeed"
];