require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const deployments = hre.deployments;

/**
 * Script to renounce all rights from our deployer address once we have confirmed everything.
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

  // TIC
  const ticAdminRole = await ticToken.ADMIN_ROLE();
  const ticMinterRole = await ticToken.MINTER_ROLE();
  console.log(`Renouncing TIC Admin Role`);
  await ticToken.renounceRole(ticAdminRole, accounts[0].address);
  console.log(`Renouncing TIC Minter Role`);
  await ticToken.renounceRole(ticMinterRole, accounts[0].address);

  // TIME TOKEN DAO
  const timeTokenDAOAdminRole = await timeTokenDAO.ADMIN_ROLE();
  const timeTokenDAOMinterRole = await timeTokenDAO.MINTER_ROLE();
  console.log(`Renouncing DAO Time Token Admin Role`);
  await timeTokenDAO.renounceRole(timeTokenDAOAdminRole, accounts[0].address);
  console.log(`Renouncing DAO Time Token Minter Role`);
  await timeTokenDAO.renounceRole(timeTokenDAOMinterRole, accounts[0].address);

  // TIME TOKEN TEAM
  const timeTokenTeamAdminRole = await timeTokenTeam.ADMIN_ROLE();
  const timeTokenTeamMinterRole = await timeTokenTeam.MINTER_ROLE();
  console.log(`Renouncing Team Time Token Admin Role`);
  await timeTokenTeam.renounceRole(timeTokenTeamAdminRole, accounts[0].address);
  console.log(`Renouncing Team Time Token Minter to Role`);
  await timeTokenTeam.renounceRole(timeTokenTeamMinterRole, accounts[0].address);

  // TIME TOKEN TEAM
  const timeTokenPreSeedAdminRole = await timeTokenPreSeed.ADMIN_ROLE();
  const timeTokenPreSeedMinterRole = await timeTokenPreSeed.MINTER_ROLE();
  console.log(`Renouncing PreSeed Time Token Admin Role`);
  await timeTokenPreSeed.renounceRole(timeTokenPreSeedAdminRole, accounts[0].address);
  console.log(`Renouncing PreSeed Time Token Minter Role`);
  await timeTokenPreSeed.renounceRole(timeTokenPreSeedMinterRole, accounts[0].address);
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });