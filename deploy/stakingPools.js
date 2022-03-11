module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin, governance } = namedAccounts;
  
  // configure relative weights for emissions of tokens (NOTE: ORDER MATTERS!)
  const poolWeights = {
    team: 1600,   
    preSeed: 1000,
    dao: 1000, 
    public: 6400, // eventually this can be split into TIC<>ETH LP and TIC only. 
  }
  // establish how many tokens are emitted per second (61,000  / week / 604800 sec)
  const rewardRate = ethers.utils.parseUnits("0.100859788359788", 18); // .1008... with 18 decimals / block

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
   
    log(`Creating pool for Time Token PreSeed address:${timeTokenPreSeed.address}`);
    await stakingPools.createPool(timeTokenPreSeed.address);

    log(`Creating pool for Time Token DAO address:${timeTokenDAO.address}`);
    await stakingPools.createPool(timeTokenDAO.address);

    log(`Creating pool for TIC address:${ticToken.address}`);
    await stakingPools.createPool(ticToken.address);

    // 2. Set weights for tokens
    log(`Setting pool weights: ${JSON.stringify(poolWeights)}`);
    await stakingPools.setRewardWeights(Object.values(poolWeights), {gasLimit: 300000});

    // 3. Set the block reward rate 
    log(`Setting reward rate per block to: ${rewardRate}`);
    await stakingPools.setRewardRate(rewardRate);

    // 4. set pending governance to DAO
    log(`Setting Pending Governance to : ${governance}`);
    await stakingPools.setPendingGovernance(governance);

    // 5. grant minter role to staking pool!
    const minterRole = await ticTokenContract.MINTER_ROLE();
    await ticTokenContract.grantRole(minterRole, stakingPools.address);
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