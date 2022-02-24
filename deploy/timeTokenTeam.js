module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("TimeTokenTeam", {
    from: admin,
    contract: "TimeToken",
    args: ["ElasticSwap Team Time Token", "ES-TTT"],
  });
  if (deployResult.newlyDeployed) {
    log(
      `ElasticSwap Team Time Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["TimeTokenTeam"];