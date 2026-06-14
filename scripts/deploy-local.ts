import { ethers } from "hardhat";

async function main() {
  const Registry = await ethers.getContractFactory("ResearchContributionProofRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log(`ResearchContributionProofRegistry deployed to: ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
