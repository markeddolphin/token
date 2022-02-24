module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("TimeTokenDAO", {
    from: admin,
    contract: "TimeToken",
    args: ["ElasticSwap DAO Time Token", "ES-DTT"],
  });
  if (deployResult.newlyDeployed) {
    log(
      `ElasticSwap DAO Time Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["TimeTokenDAO"];