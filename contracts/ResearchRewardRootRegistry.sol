// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @title ResearchRewardRootRegistry
/// @notice Experimental registry for reward-ledger Merkle roots.
/// @dev Store only ledger roots and digests. Never store participant identity, raw responses, or payout details on-chain.
contract ResearchRewardRootRegistry {
    struct RewardRootRecord {
        address anchorer;
        bytes32 usageEventHash;
        bytes32 datasetManifestHash;
        bytes32 rewardLedgerHash;
        bytes32 merkleRoot;
        uint64 anchoredAt;
        string schemaVersion;
        string metadataUri;
        bool revoked;
    }

    address public owner;
    mapping(address => bool) public authorizedAnchorers;
    mapping(bytes32 => RewardRootRecord) private records;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AnchorerUpdated(address indexed anchorer, bool authorized);
    event RewardRootAnchored(
        bytes32 indexed rewardRootId,
        address indexed anchorer,
        bytes32 usageEventHash,
        bytes32 datasetManifestHash,
        bytes32 rewardLedgerHash,
        bytes32 merkleRoot,
        string schemaVersion,
        string metadataUri
    );
    event RewardRootRevoked(bytes32 indexed rewardRootId, address indexed anchorer, string reason);

    error NotOwner();
    error NotAuthorizedAnchorer();
    error InvalidRewardRootId();
    error InvalidDigest();
    error InvalidSchemaVersion();
    error RewardRootAlreadyExists();
    error RewardRootDoesNotExist();
    error RewardRootAlreadyRevoked();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAuthorizedAnchorer() {
        if (!authorizedAnchorers[msg.sender]) revert NotAuthorizedAnchorer();
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedAnchorers[msg.sender] = true;
        emit OwnershipTransferred(address(0), msg.sender);
        emit AnchorerUpdated(msg.sender, true);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "new owner is zero address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function setAnchorer(address anchorer, bool authorized) external onlyOwner {
        require(anchorer != address(0), "anchorer is zero address");
        authorizedAnchorers[anchorer] = authorized;
        emit AnchorerUpdated(anchorer, authorized);
    }

    function anchorRewardRoot(
        bytes32 rewardRootId,
        bytes32 usageEventHash,
        bytes32 datasetManifestHash,
        bytes32 rewardLedgerHash,
        bytes32 merkleRoot,
        string calldata schemaVersion,
        string calldata metadataUri
    ) external onlyAuthorizedAnchorer {
        if (rewardRootId == bytes32(0)) revert InvalidRewardRootId();
        if (usageEventHash == bytes32(0) || datasetManifestHash == bytes32(0) || rewardLedgerHash == bytes32(0) || merkleRoot == bytes32(0)) {
            revert InvalidDigest();
        }
        if (bytes(schemaVersion).length == 0) revert InvalidSchemaVersion();
        if (records[rewardRootId].anchoredAt != 0) revert RewardRootAlreadyExists();

        records[rewardRootId] = RewardRootRecord({
            anchorer: msg.sender,
            usageEventHash: usageEventHash,
            datasetManifestHash: datasetManifestHash,
            rewardLedgerHash: rewardLedgerHash,
            merkleRoot: merkleRoot,
            anchoredAt: uint64(block.timestamp),
            schemaVersion: schemaVersion,
            metadataUri: metadataUri,
            revoked: false
        });

        emit RewardRootAnchored(
            rewardRootId,
            msg.sender,
            usageEventHash,
            datasetManifestHash,
            rewardLedgerHash,
            merkleRoot,
            schemaVersion,
            metadataUri
        );
    }

    function revokeRewardRoot(bytes32 rewardRootId, string calldata reason) external onlyAuthorizedAnchorer {
        RewardRootRecord storage record = records[rewardRootId];
        if (record.anchoredAt == 0) revert RewardRootDoesNotExist();
        if (record.revoked) revert RewardRootAlreadyRevoked();
        require(record.anchorer == msg.sender || msg.sender == owner, "only anchorer or owner");

        record.revoked = true;
        emit RewardRootRevoked(rewardRootId, msg.sender, reason);
    }

    function getRewardRoot(bytes32 rewardRootId) external view returns (RewardRootRecord memory) {
        RewardRootRecord memory record = records[rewardRootId];
        if (record.anchoredAt == 0) revert RewardRootDoesNotExist();
        return record;
    }

    function isValidRewardRoot(bytes32 rewardRootId, bytes32 rewardLedgerHash, bytes32 merkleRoot) external view returns (bool) {
        RewardRootRecord memory record = records[rewardRootId];
        return record.anchoredAt != 0 && !record.revoked && record.rewardLedgerHash == rewardLedgerHash && record.merkleRoot == merkleRoot;
    }
}
