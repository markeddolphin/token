module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("TimeTokenPreSeed", {
    from: admin,
    contract: "TimeToken",
    args: ["ElasticSwap Pre-Seed Time Token", "ES-PSTT"],
  });
  if (deployResult.newlyDeployed) {
    log(
      `ElasticSwap Pre-Seed Time Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["TimeTokenPreSeed"];