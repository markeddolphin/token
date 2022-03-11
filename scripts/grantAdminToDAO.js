require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const deployments = hre.deployments;

/**
 * Script to transfer all rights to the DAO
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
  console.log(`Granting TIC Admin to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await ticToken.grantRole(ticAdminRole, process.env.AVAX_GOVERNANCE_ADDRESS);
  
  // TIME TOKEN DAO
  const timeTokenDAOAdminRole = await timeTokenDAO.ADMIN_ROLE();
  const timeTokenDAOMinterRole = await timeTokenDAO.MINTER_ROLE();
  console.log(`Granting DAO Time Token Admin to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenDAO.grantRole(timeTokenDAOAdminRole, process.env.AVAX_GOVERNANCE_ADDRESS);
  console.log(`Granting DAO Time Token Minter to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenDAO.grantRole(timeTokenDAOMinterRole, process.env.AVAX_GOVERNANCE_ADDRESS);

  // TIME TOKEN TEAM
  const timeTokenTeamAdminRole = await timeTokenTeam.ADMIN_ROLE();
  const timeTokenTeamMinterRole = await timeTokenTeam.MINTER_ROLE();
  console.log(`Granting Team Time Token Admin to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenTeam.grantRole(timeTokenTeamAdminRole, process.env.AVAX_GOVERNANCE_ADDRESS);
  console.log(`Granting Team Time Token Minter to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenTeam.grantRole(timeTokenTeamMinterRole, process.env.AVAX_GOVERNANCE_ADDRESS);

  // TIME TOKEN TEAM
  const timeTokenPreSeedAdminRole = await timeTokenPreSeed.ADMIN_ROLE();
  const timeTokenPreSeedMinterRole = await timeTokenPreSeed.MINTER_ROLE();
  console.log(`Granting PreSeed Time Token Admin to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenPreSeed.grantRole(timeTokenPreSeedAdminRole, process.env.AVAX_GOVERNANCE_ADDRESS);
  console.log(`Granting PreSeed Time Token Minter to DAO:${process.env.AVAX_GOVERNANCE_ADDRESS}`);
  await timeTokenPreSeed.grantRole(timeTokenPreSeedMinterRole, process.env.AVAX_GOVERNANCE_ADDRESS);
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });