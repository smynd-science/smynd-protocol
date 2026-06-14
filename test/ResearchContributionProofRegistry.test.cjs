const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ResearchContributionProofRegistry", function () {
  async function deployFixture() {
    const [owner, issuer, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("ResearchContributionProofRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    return { registry, owner, issuer, other };
  }

  const proofId = "0x1111111111111111111111111111111111111111111111111111111111111111";
  const proofDigest = "0x2222222222222222222222222222222222222222222222222222222222222222";
  const studyCommitment = "0x3333333333333333333333333333333333333333333333333333333333333333";
  const taskCommitment = "0x4444444444444444444444444444444444444444444444444444444444444444";
  const contributionCommitment = "0x5555555555555555555555555555555555555555555555555555555555555555";

  it("records a proof from the owner issuer", async function () {
    const { registry } = await deployFixture();

    await expect(
      registry.recordProof(
        proofId,
        proofDigest,
        studyCommitment,
        taskCommitment,
        contributionCommitment,
        "smynd-proof-v0.1",
        "ipfs://example"
      )
    ).to.emit(registry, "ProofRecorded");

    expect(await registry.isValidProof(proofId, proofDigest)).to.equal(true);
  });

  it("rejects unauthorized issuers", async function () {
    const { registry, other } = await deployFixture();

    await expect(
      registry.connect(other).recordProof(
        proofId,
        proofDigest,
        studyCommitment,
        taskCommitment,
        contributionCommitment,
        "smynd-proof-v0.1",
        ""
      )
    ).to.be.revertedWithCustomError(registry, "NotAuthorizedIssuer");
  });

  it("allows owner to authorize an issuer", async function () {
    const { registry, issuer } = await deployFixture();
    await registry.setIssuer(issuer.address, true);

    await expect(
      registry.connect(issuer).recordProof(
        proofId,
        proofDigest,
        studyCommitment,
        taskCommitment,
        contributionCommitment,
        "smynd-proof-v0.1",
        ""
      )
    ).to.emit(registry, "ProofRecorded");
  });

  it("rejects duplicate proof ids", async function () {
    const { registry } = await deployFixture();

    await registry.recordProof(
      proofId,
      proofDigest,
      studyCommitment,
      taskCommitment,
      contributionCommitment,
      "smynd-proof-v0.1",
      ""
    );

    await expect(
      registry.recordProof(
        proofId,
        proofDigest,
        studyCommitment,
        taskCommitment,
        contributionCommitment,
        "smynd-proof-v0.1",
        ""
      )
    ).to.be.revertedWithCustomError(registry, "ProofAlreadyExists");
  });

  it("revokes a proof", async function () {
    const { registry } = await deployFixture();

    await registry.recordProof(
      proofId,
      proofDigest,
      studyCommitment,
      taskCommitment,
      contributionCommitment,
      "smynd-proof-v0.1",
      ""
    );

    await expect(registry.revokeProof(proofId, "issued in error")).to.emit(registry, "ProofRevoked");
    expect(await registry.isValidProof(proofId, proofDigest)).to.equal(false);
  });
});
