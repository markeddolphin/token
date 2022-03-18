# Deployed Addresses

### TIC and Staking 
deployed commit [653d1e6](https://github.com/ElasticSwap/token/tree/653d1e687454d8934868747534c71b3a414c3b8c)

- [StakingPools](https://snowtrace.io/address/0x416494bD4FbEe227313b76a07A1e859928D7bA47) - 0x416494bD4FbEe227313b76a07A1e859928D7bA47
- [TIC Token](https://snowtrace.io/address/0x75739a693459f33B1FBcC02099eea3eBCF150cBe) - 0x75739a693459f33B1FBcC02099eea3eBCF150cBe
- [TIME Token DAO](https://snowtrace.io/address/0xBA41c2A2744e3749ab3E76FdFe6FCa5875D97660) - 0xBA41c2A2744e3749ab3E76FdFe6FCa5875D97660
- [TIME Token Team](https://snowtrace.io/address/0x31fa86c83aE739220CE4fa93391BB321cC77670E) - 0x31fa86c83aE739220CE4fa93391BB321cC77670E
- [TIME Token PreSeed](https://snowtrace.io/address/0x65C8CB3AFF7021c9A1579787e29B1c3D24c5cA59) - 0x65C8CB3AFF7021c9A1579787e29B1c3D24c5cA59

### Mainnet deployment instructions
1. Update .env file for correct keys and addresses.
1. Update desired gas price in hardhat (https://snowtrace.io/gastracker)
1. Deploy contracts to avalanche `npx hardhat deploy --network avalanche  --export-all ./artifacts/deployments.json`
1. Verify on etherscan `npx hardhat --network avalanche etherscan-verify --api-key <APIKEY>`
1. Pre-mine TIC to DAO and mint all TIME tokens `HARDHAT_NETWORK="avalanche" node scripts/mintTokens.js` 
   1. Pre-mine tokens to DAO
   1. Mint DAO Time token to DAO
   1. Mint Team Time token to Team
   1. Mint Pre-Seed Time token to pre-seed
1. Create initial Sushi pool for TIC <> USDC from DAO and seed round
1. Add the new Sushi LP address to .env
1. Create pool for Sushi LP tokens `HARDHAT_NETWORK="avalanche" node scripts/createSushiPool.js`
1. Set weights for all pools `HARDHAT_NETWORK="avalanche" node scripts/setPoolWeights.js`
1. Confirm pool addresses and weights on snowscan.
1. Grant admin rights to DAO `HARDHAT_NETWORK="avalanche" node scripts/grantAdminToDAO.js` 
   1. Grant TIC Token admin DAO
   1. Grant DAO Time token admin and minter to DAO
   1. Grant Team Time token admin and minter to DAO
   1. Grant Pre-Seed Time token admin and minter to DAO
1. Confirm on snowscan correct admin permissions for the DAO for all 4 token contracts.
1. DAO accept pending governance from StakingPools.sol
1. Stake DAO time token
1. From DAO, call `setRewardRate` to enable staking for initial pools. LP, TIC, DAO 
1. Renounce all rights from deployer address `HARDHAT_NETWORK="avalanche" node scripts/renounceRoles.js` 
1. Publish all mainnet addresses
1. When ready from DAO, call setRewardRate to enable staking (~24 hrs later) and set updated pool weights. 