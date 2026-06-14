const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ResearchRewardRootRegistry", function () {
  async function deployFixture() {
    const [owner, anchorer, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("ResearchRewardRootRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    return { registry, owner, anchorer, other };
  }

  const rewardRootId = "0x1111111111111111111111111111111111111111111111111111111111111111";
  const usageEventHash = "0x2222222222222222222222222222222222222222222222222222222222222222";
  const datasetManifestHash = "0x3333333333333333333333333333333333333333333333333333333333333333";
  const rewardLedgerHash = "0x4444444444444444444444444444444444444444444444444444444444444444";
  const merkleRoot = "0x5555555555555555555555555555555555555555555555555555555555555555";

  it("anchors a reward root from the owner anchorer", async function () {
    const { registry } = await deployFixture();

    await expect(
      registry.anchorRewardRoot(
        rewardRootId,
        usageEventHash,
        datasetManifestHash,
        rewardLedgerHash,
        merkleRoot,
        "smynd-reward-ledger-v0.1",
        "ipfs://reward-ledger"
      )
    ).to.emit(registry, "RewardRootAnchored");

    expect(await registry.isValidRewardRoot(rewardRootId, rewardLedgerHash, merkleRoot)).to.equal(true);
  });

  it("rejects unauthorized anchorers", async function () {
    const { registry, other } = await deployFixture();

    await expect(
      registry.connect(other).anchorRewardRoot(
        rewardRootId,
        usageEventHash,
        datasetManifestHash,
        rewardLedgerHash,
        merkleRoot,
        "smynd-reward-ledger-v0.1",
        ""
      )
    ).to.be.revertedWithCustomError(registry, "NotAuthorizedAnchorer");
  });

  it("allows owner to authorize an anchorer", async function () {
    const { registry, anchorer } = await deployFixture();
    await registry.setAnchorer(anchorer.address, true);

    await expect(
      registry.connect(anchorer).anchorRewardRoot(
        rewardRootId,
        usageEventHash,
        datasetManifestHash,
        rewardLedgerHash,
        merkleRoot,
        "smynd-reward-ledger-v0.1",
        ""
      )
    ).to.emit(registry, "RewardRootAnchored");
  });

  it("rejects duplicate reward root ids", async function () {
    const { registry } = await deployFixture();

    await registry.anchorRewardRoot(rewardRootId, usageEventHash, datasetManifestHash, rewardLedgerHash, merkleRoot, "smynd-reward-ledger-v0.1", "");

    await expect(
      registry.anchorRewardRoot(rewardRootId, usageEventHash, datasetManifestHash, rewardLedgerHash, merkleRoot, "smynd-reward-ledger-v0.1", "")
    ).to.be.revertedWithCustomError(registry, "RewardRootAlreadyExists");
  });

  it("revokes a reward root", async function () {
    const { registry } = await deployFixture();

    await registry.anchorRewardRoot(rewardRootId, usageEventHash, datasetManifestHash, rewardLedgerHash, merkleRoot, "smynd-reward-ledger-v0.1", "");

    await expect(registry.revokeRewardRoot(rewardRootId, "issued in error")).to.emit(registry, "RewardRootRevoked");
    expect(await registry.isValidRewardRoot(rewardRootId, rewardLedgerHash, merkleRoot)).to.equal(false);
  });
});
