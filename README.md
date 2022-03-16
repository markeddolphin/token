# Mainnet deployment instructions
1. Update .env file for correct keys and addresses.
1. Update desired gas price in hardhat (https://snowtrace.io/gastracker)
1. Deploy contracts to avalanche `npx hardhat deploy --network avalanche  --export-all ./artifacts/deployments.json`
1. Verify on etherscan `npx hardhat --network avalanche etherscan-verify --api-key <APIKEY>`
1. Pre-mine TIC to DAO and mint all TIME tokens `HARDHAT_NETWORK="avalanche" node scripts/mintTokens.js` 
   1. Pre-mine tokens to DAO
   1. Mint DAO Time token to DAO
   1. Mint Team Time token to Team
   1. Mint Pre-Seed Time token to pre-seed
1. Create initial Sushi pool for TIC <> USDC from DAO and seed round (TODO)
1. Add the new Sushi LP address to .env (TODO)
1. Create pool for Sushi LP tokens `HARDHAT_NETWORK="avalanche" node scripts/createSushiPool.js` (TODO)
1. Set weights for all pools `HARDHAT_NETWORK="avalanche" node scripts/setPoolWeights.js` (TODO)
1. Confirm pool addresses and weights on snowscan. (TODO)
1. Grant admin rights to DAO `HARDHAT_NETWORK="avalanche" node scripts/grantAdminToDAO.js` 
   1. Grant TIC Token admin DAO
   1. Grant DAO Time token admin and minter to DAO
   1. Grant Team Time token admin and minter to DAO
   1. Grant Pre-Seed Time token admin and minter to DAO
1. Confirm on snowscan correct admin permissions for the DAO for all 4 token contracts. (TODO)
1. DAO accept pending governance from StakingPools.sol
1. Stake DAO time token
1. From DAO, call `setRewardRate` to enable staking for initial pools. LP, TIC, DAO 
    1. 74636243386243120 // .074636...
1. Renounce all rights from deployer address `HARDHAT_NETWORK="avalanche" node scripts/renounceRoles.js` 
1. Publish all mainnet addresses
1. When ready from DAO, call setRewardRate to enable staking (~24 hrs later) and set updated pool weights. 
    1. 100859788359788000 // .1008....
    1. const POOL_WEIGHTS = {
        team: 1600,
        preSeed: 1000,
        dao: 1000,
        tic: 1600, // single side
        lp: 4800, // lp tokens
      };
1. Enable Sablier streams for Seed participants