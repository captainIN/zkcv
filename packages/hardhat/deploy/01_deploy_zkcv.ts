import { HardhatRuntimeEnvironment } from "hardhat/types";

async function deployZkCV(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ZkCV", {
    from: deployer,
    log: true,
  });
}

export default deployZkCV;
deployZkCV.tags = ["ZkCV"];
