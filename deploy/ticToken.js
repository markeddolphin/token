module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { admin } = namedAccounts;

  const deployResult = await deploy("TicToken", {
    from: admin,
    contract: "TicToken",
  });
  if (deployResult.newlyDeployed) {
    log(
      `TIC Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }
};
module.exports.tags = ["TicToken"];