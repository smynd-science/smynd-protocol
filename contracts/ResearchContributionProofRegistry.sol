// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @title ResearchContributionProofRegistry
/// @notice Experimental registry for privacy-preserving research contribution proof digests.
/// @dev This contract must not receive raw participant data. Store only commitments and proof digests.
contract ResearchContributionProofRegistry {
    struct ProofRecord {
        address issuer;
        bytes32 proofDigest;
        bytes32 studyCommitment;
        bytes32 taskCommitment;
        bytes32 contributionCommitment;
        uint64 issuedAt;
        string schemaVersion;
        string metadataUri;
        bool revoked;
    }

    address public owner;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => ProofRecord) private records;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event IssuerUpdated(address indexed issuer, bool authorized);
    event ProofRecorded(
        bytes32 indexed proofId,
        address indexed issuer,
        bytes32 proofDigest,
        bytes32 studyCommitment,
        bytes32 taskCommitment,
        bytes32 contributionCommitment,
        string schemaVersion,
        string metadataUri
    );
    event ProofRevoked(bytes32 indexed proofId, address indexed issuer, string reason);

    error NotOwner();
    error NotAuthorizedIssuer();
    error InvalidProofId();
    error InvalidDigest();
    error InvalidSchemaVersion();
    error ProofAlreadyExists();
    error ProofDoesNotExist();
    error ProofAlreadyRevoked();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAuthorizedIssuer() {
        if (!authorizedIssuers[msg.sender]) revert NotAuthorizedIssuer();
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit OwnershipTransferred(address(0), msg.sender);
        emit IssuerUpdated(msg.sender, true);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "new owner is zero address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function setIssuer(address issuer, bool authorized) external onlyOwner {
        require(issuer != address(0), "issuer is zero address");
        authorizedIssuers[issuer] = authorized;
        emit IssuerUpdated(issuer, authorized);
    }

    function recordProof(
        bytes32 proofId,
        bytes32 proofDigest,
        bytes32 studyCommitment,
        bytes32 taskCommitment,
        bytes32 contributionCommitment,
        string calldata schemaVersion,
        string calldata metadataUri
    ) external onlyAuthorizedIssuer {
        if (proofId == bytes32(0)) revert InvalidProofId();
        if (proofDigest == bytes32(0)) revert InvalidDigest();
        if (bytes(schemaVersion).length == 0) revert InvalidSchemaVersion();
        if (records[proofId].issuedAt != 0) revert ProofAlreadyExists();

        records[proofId] = ProofRecord({
            issuer: msg.sender,
            proofDigest: proofDigest,
            studyCommitment: studyCommitment,
            taskCommitment: taskCommitment,
            contributionCommitment: contributionCommitment,
            issuedAt: uint64(block.timestamp),
            schemaVersion: schemaVersion,
            metadataUri: metadataUri,
            revoked: false
        });

        emit ProofRecorded(
            proofId,
            msg.sender,
            proofDigest,
            studyCommitment,
            taskCommitment,
            contributionCommitment,
            schemaVersion,
            metadataUri
        );
    }

    function revokeProof(bytes32 proofId, string calldata reason) external onlyAuthorizedIssuer {
        ProofRecord storage record = records[proofId];
        if (record.issuedAt == 0) revert ProofDoesNotExist();
        if (record.revoked) revert ProofAlreadyRevoked();
        require(record.issuer == msg.sender || msg.sender == owner, "only issuer or owner");

        record.revoked = true;
        emit ProofRevoked(proofId, msg.sender, reason);
    }

    function getProof(bytes32 proofId) external view returns (ProofRecord memory) {
        ProofRecord memory record = records[proofId];
        if (record.issuedAt == 0) revert ProofDoesNotExist();
        return record;
    }

    function isValidProof(bytes32 proofId, bytes32 proofDigest) external view returns (bool) {
        ProofRecord memory record = records[proofId];
        return record.issuedAt != 0 && !record.revoked && record.proofDigest == proofDigest;
    }
}
