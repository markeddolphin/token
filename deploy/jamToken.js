module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("JamToken", {
    from: admin,
    contract: "JamToken",
  });
  if (deployResult.newlyDeployed) {
    log(
      `Jam Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["JamToken"];