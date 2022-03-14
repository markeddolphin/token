require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const deployments = hre.deployments;

const DECIMALS = 18;
const DAO_PRE_MINE = ethers.utils.parseUnits("652560", DECIMALS);
const TEAM_ALLOCATION = {
  "0x1D0c8C3e2Ce611E9D85fBB44F0Ec9eeef2549191" : ethers.utils.parseUnits("500", DECIMALS),
  "0x022Cec2911Dbb3E49e1375B7c9eaa94F5cc7c8Bd" : ethers.utils.parseUnits("500", DECIMALS),
  "0xF7a94CCB3048Bdc95f8041D0a2D7bf939479f99d" : ethers.utils.parseUnits("250", DECIMALS),
  "0x5805b9Ef3A7E6b26B8CF1CEa42b06EfE598C526A" : ethers.utils.parseUnits("100", DECIMALS),
  "0x5805b9Ef3A7E6b26B8CF1CEa42b06EfE598C526A" : ethers.utils.parseUnits("100", DECIMALS), // designer
  "0xa2dfA6120e342C2287d613Ca7896A7F34f7bCA56" : ethers.utils.parseUnits("50", DECIMALS), 
  "0x5aFDB0508F34A72139e4fA5F5672fFadee8a5Aa6" : ethers.utils.parseUnits("10", DECIMALS),
}

/**
 * Script to pre-mine DAO tokens as well as mint needed TIME tokens
 */
async function main () {
  accounts = await ethers.getSigners();

  const TicToken = await deployments.get("TicToken");
  const TimeTokenDAO = await deployments.get("TimeTokenDAO");
  const TimeTokenTeam = await deployments.get("TimeTokenTeam");
  const TimeTokenPreSeed = await deployments.get("TimeTokenPreSeed");

  const ticToken = new ethers.Contract(
    TicToken.address,
    TicToken.abi,
    accounts[0]
  );
  const timeTokenDAO = new ethers.Contract(
    TimeTokenDAO.address,
    TimeTokenDAO.abi,
    accounts[0]
  );
  const timeTokenTeam = new ethers.Contract(
    TimeTokenTeam.address,
    TimeTokenTeam.abi,
    accounts[0]
  );
  const timeTokenPreSeed = new ethers.Contract(
    TimeTokenPreSeed.address,
    TimeTokenPreSeed.abi,
    accounts[0]
  );

  console.log(`Pre-mining TIC Tokens to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await ticToken.mint(process.env.AVAX_GOVERNANCE_ADDRESS, DAO_PRE_MINE); 

  console.log(`Minting TIME Token to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenDAO.mint(process.env.AVAX_GOVERNANCE_ADDRESS, ethers.utils.parseUnits("1", 18));

  console.log('Minting TIME Token to team');
  for (var address of Object.keys(TEAM_ALLOCATION)) {
    console.log(`Minting team token to:${address}`);
    await timeTokenTeam.mint(address, TEAM_ALLOCATION[address]);
  }

  console.log('Minting TIME Token to pre-seed...');
  // TODO:
  
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });