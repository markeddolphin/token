const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("StakingPools", () => {
  let stakingPools;
  let timeTokenTeam;
  let timeTokenDAO;
  let timeTokenPreSeed;
  let jamToken;
  let accounts;
  let namedAccounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    await deployments.fixture();

    const StakingPools = await deployments.get("StakingPools");
    stakingPools = new ethers.Contract(
      StakingPools.address,
      StakingPools.abi,
      accounts[0]
    );

    const JamToken = await deployments.get("JamToken");
    jamToken = new ethers.Contract(JamToken.address, JamToken.abi, accounts[0]);

    const TimeTokenTeam = await deployments.get("TimeTokenTeam");
    timeTokenTeam = new ethers.Contract(
      TimeTokenTeam.address,
      TimeTokenTeam.abi,
      accounts[0]
    );

    const TimeTokenDAO = await deployments.get("TimeTokenDAO");
    timeTokenDAO = new ethers.Contract(
      TimeTokenDAO.address,
      TimeTokenDAO.abi,
      accounts[0]
    );

    const TimeTokenPreSeed = await deployments.get("TimeTokenPreSeed");
    timeTokenPreSeed = new ethers.Contract(
      TimeTokenPreSeed.address,
      TimeTokenPreSeed.abi,
      accounts[0]
    );
    namedAccounts = await getNamedAccounts();
  });

  describe("constructor", () => {
    it("Should have the correct rewards token, JAM", async () => {
      expect(await stakingPools.reward()).to.equal(jamToken.address);
    });

    it("Should have the correct pending governance", async () => {
      expect(await stakingPools.pendingGovernance()).to.equal(namedAccounts.governance);
    });
    
  });

  describe("emissions are set properly in initial deployment", () => {
    it("Team tokens are configured properly", async () => {
      const teamAllocationPercent = 16;
      const totalEmissionsPerBlock = ethers.utils.parseUnits("2.0", 18);
      const teamEmissionsPerBlock = totalEmissionsPerBlock.mul(teamAllocationPercent).div(100);
      
      expect(await stakingPools.rewardRate()).to.equal(totalEmissionsPerBlock);
      expect(await stakingPools.getPoolToken(0)).to.equal(timeTokenTeam.address);
      expect(await stakingPools.getPoolRewardWeight(0)).to.equal(1600);
      expect(await stakingPools.getPoolRewardRate(0)).to.equal(teamEmissionsPerBlock);
    });

    it("Pre-seed tokens are configured properly", async () => {
      const allocationPercent = 10;
      const totalEmissionsPerBlock = ethers.utils.parseUnits("2.0", 18);
      const emissionsPerBlock = totalEmissionsPerBlock.mul(allocationPercent).div(100);
      
      expect(await stakingPools.rewardRate()).to.equal(totalEmissionsPerBlock);
      expect(await stakingPools.getPoolToken(1)).to.equal(timeTokenPreSeed.address);
      expect(await stakingPools.getPoolRewardWeight(1)).to.equal(1000);
      expect(await stakingPools.getPoolRewardRate(1)).to.equal(emissionsPerBlock);
    });

    it("DAO tokens are configured properly", async () => {
      const allocationPercent = 10;
      const totalEmissionsPerBlock = ethers.utils.parseUnits("2.0", 18);
      const emissionsPerBlock = totalEmissionsPerBlock.mul(allocationPercent).div(100);
      
      expect(await stakingPools.rewardRate()).to.equal(totalEmissionsPerBlock);
      expect(await stakingPools.getPoolToken(2)).to.equal(timeTokenDAO.address);
      expect(await stakingPools.getPoolRewardWeight(2)).to.equal(1000);
      expect(await stakingPools.getPoolRewardRate(2)).to.equal(emissionsPerBlock);
    });

    it("JAM staking is configured properly", async () => {
      const allocationPercent = 64;
      const totalEmissionsPerBlock = ethers.utils.parseUnits("2.0", 18);
      const emissionsPerBlock = totalEmissionsPerBlock.mul(allocationPercent).div(100);
      
      expect(await stakingPools.rewardRate()).to.equal(totalEmissionsPerBlock);
      expect(await stakingPools.getPoolToken(3)).to.equal(jamToken.address);
      expect(await stakingPools.getPoolRewardWeight(3)).to.equal(6400);
      expect(await stakingPools.getPoolRewardRate(3)).to.equal(emissionsPerBlock);
    });



  });
  
  // test getpoolToken and getPoolRewardWeight
  // getPoolRewardRate

  // describe("createNewExchange", () => {
  //   it("Should deploy a new exchange and add to mappings", async () => {
  //     await exchangeFactory
  //       .connect(deployer)
  //       .createNewExchange(baseToken.address, quoteToken.address);
  //     const exchangeAddress =
  //       await exchangeFactory.exchangeAddressByTokenAddress(
  //         baseToken.address,
  //         quoteToken.address
  //       );
  //     expect(
  //       await exchangeFactory.isValidExchangeAddress(exchangeAddress)
  //     ).to.equal(true);
  //   });

  //   it("Should deploy a new exchange with correct name, symbol and addresses", async () => {
  //     await exchangeFactory
  //       .connect(deployer)
  //       .createNewExchange(baseToken.address, quoteToken.address);

  //     const exchangeAddress =
  //       await exchangeFactory.exchangeAddressByTokenAddress(
  //         baseToken.address,
  //         quoteToken.address
  //       );

  //     const Exchange = await deployments.get("EGT Exchange");
  //     const exchange = new ethers.Contract(
  //       exchangeAddress,
  //       Exchange.abi,
  //       deployer
  //     );

  //     expect(await exchange.name()).to.equal(
  //       "ETMvFUSD ElasticSwap Liquidity Token"
  //     );
  //     expect(await exchange.symbol()).to.equal("ETMvFUSD-ELP");
  //     expect(await exchange.quoteToken()).to.equal(quoteToken.address);
  //     expect(await exchange.baseToken()).to.equal(baseToken.address);
  //   });

  //   it("Should deploy a new exchange and emit the correct ExchangeAdded event", async () => {
  //     expect(
  //       await exchangeFactory
  //         .connect(deployer)
  //         .createNewExchange(baseToken.address, quoteToken.address)
  //     ).to.emit(exchangeFactory, "NewExchange");
  //   });

  //   it("Should revert when the same token pair is attempted to be added twice", async () => {
  //     await exchangeFactory
  //       .connect(deployer)
  //       .createNewExchange(baseToken.address, quoteToken.address);
  //     await expect(
  //       exchangeFactory
  //         .connect(deployer)
  //         .createNewExchange(baseToken.address, quoteToken.address)
  //     ).to.be.revertedWith("ExchangeFactory: DUPLICATE_EXCHANGE");
  //   });

  //   it("Should revert when the same token is attempted to be used for both quote and base", async () => {
  //     await expect(
  //       exchangeFactory
  //         .connect(deployer)
  //         .createNewExchange(baseToken.address, baseToken.address)
  //     ).to.be.revertedWith("ExchangeFactory: IDENTICAL_TOKENS");
  //   });

  //   it("Should revert when either token address is a null address", async () => {
  //     await expect(
  //       exchangeFactory
  //         .connect(deployer)
  //         .createNewExchange(baseToken.address, ethers.constants.AddressZero)
  //     ).to.be.revertedWith("ExchangeFactory: INVALID_TOKEN_ADDRESS");

  //     await expect(
  //       exchangeFactory
  //         .connect(deployer)
  //         .createNewExchange(ethers.constants.AddressZero, quoteToken.address)
  //     ).to.be.revertedWith("ExchangeFactory: INVALID_TOKEN_ADDRESS");
  //   });

  //   it("Should revert when a non owner attempts to change the fee address", async () => {
  //     const newFeeAddress = accounts[8].address;
  //     await expect(
  //       exchangeFactory.connect(accounts[1]).setFeeAddress(newFeeAddress)
  //     ).to.be.revertedWith("Ownable: caller is not the owner");
  //   });
  // });

  // describe("setFeeAddress", () => {
  //   it("Should allow the fee address to be changed by the owner", async () => {
  //     const newFeeAddress = accounts[8].address;
  //     await exchangeFactory.setFeeAddress(newFeeAddress);
  //     expect(await exchangeFactory.feeAddress()).to.equal(newFeeAddress);
  //   });

  //   it("Should emit SetFeeAddress", async () => {
  //     const newFeeAddress = accounts[8].address;
  //     await expect(exchangeFactory.setFeeAddress(newFeeAddress))
  //       .to.emit(exchangeFactory, "SetFeeAddress")
  //       .withArgs(newFeeAddress);
  //   });

  //   it("Should revert when the fee a owner attempts to change the fee address", async () => {
  //     const newFeeAddress = accounts[8].address;
  //     await expect(
  //       exchangeFactory.connect(accounts[1]).setFeeAddress(newFeeAddress)
  //     ).to.be.revertedWith("Ownable: caller is not the owner");
  //   });

  //   it("Should revert when the owner attempts to change the fee address to the zero address", async () => {
  //     await expect(
  //       exchangeFactory.setFeeAddress(ethers.constants.AddressZero)
  //     ).to.be.revertedWith("ExchangeFactory: INVAlID_FEE_ADDRESS");
  //   });

  //   it("Should revert when the owner attempts to change the fee address to the same address", async () => {
  //     await expect(
  //       exchangeFactory.setFeeAddress(await exchangeFactory.feeAddress())
  //     ).to.be.revertedWith("ExchangeFactory: INVAlID_FEE_ADDRESS");
  //   });
  // });
});
