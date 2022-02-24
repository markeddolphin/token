module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("FixedPointMath", {
    from: admin,
    contract: "FixedPointMath",
    args: [],
  });
  if (deployResult.newlyDeployed) {
    log(
      `Library FixedPointMath deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["FixedPointMath"];
