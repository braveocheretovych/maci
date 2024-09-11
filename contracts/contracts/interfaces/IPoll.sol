// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { DomainObjs } from "../utilities/DomainObjs.sol";
import { IMACI } from "./IMACI.sol";

/// @title IPoll
/// @notice Poll interface
interface IPoll {
  /// @notice Join the poll
  function joinPoll(
    uint256 _nullifier,
    DomainObjs.PubKey memory _pubKey,
    uint256 _newVoiceCreditBalance,
    uint256 _stateRootIndex,
    uint256[8] memory _proof
  ) external;

  /// @notice The number of messages which have been processed and the number of signups
  /// @return numSignups The number of signups
  /// @return numMsgs The number of messages sent by voters
  function numSignUpsAndMessages() external view returns (uint256 numSignups, uint256 numMsgs);

  /// @notice Get all message batch hashes
  /// @return betchHashes array containing all batch hashes
  function getBatchHashes() external view returns (uint256[] memory);

  /// @notice Pad last unclosed batch
  function padLastBatch() external;

  /// @notice Allows anyone to publish a message (an encrypted command and signature).
  /// This function also enqueues the message.
  /// @param _message The message to publish
  /// @param _encPubKey An epheremal public key which can be combined with the
  /// coordinator's private key to generate an ECDH shared key with which
  /// to encrypt the message.
  function publishMessage(DomainObjs.Message memory _message, DomainObjs.PubKey calldata _encPubKey) external;

  /// @notice The second step of merging the poll state. This allows the
  /// ProcessMessages circuit to access the latest state tree and ballots via
  /// currentSbCommitment.
  function mergeState() external;

  /// @notice Returns the Poll's deploy time and duration
  /// @return _deployTime The deployment timestamp
  /// @return _duration The duration of the poll
  function getDeployTimeAndDuration() external view returns (uint256 _deployTime, uint256 _duration);

  /// @notice Get the result of whether the MACI contract's stateAq has been merged by this contract
  /// @return Whether the MACI contract's stateAq has been merged by this contract
  function stateMerged() external view returns (bool);

  /// @notice Get the depths of the merkle trees
  /// @return intStateTreeDepth The depth of the state tree
  /// @return voteOptionTreeDepth The subdepth of the vote option tree
  function treeDepths() external view returns (uint8 intStateTreeDepth, uint8 voteOptionTreeDepth);

  /// @notice Get the max vote options for the poll
  /// @return maxVoteOptions The maximum number of vote options
  function maxVoteOptions() external view returns (uint256);

  /// @notice Get message batch size for the poll
  /// @return The message batch size
  function messageBatchSize() external view returns (uint8);

  /// @notice Get the hash of coordinator's public key
  /// @return _coordinatorPubKeyHash the hash of coordinator's public key
  function coordinatorPubKeyHash() external view returns (uint256 _coordinatorPubKeyHash);

  /// @notice Get the commitment to the state leaves and the ballots. This is
  /// hash3(stateRoot, ballotRoot, salt).
  /// Its initial value should be
  /// hash(maciStateRootSnapshot, emptyBallotRoot, 0)
  /// Each successful invocation of processMessages() should use a different
  /// salt to update this value, so that an external observer cannot tell in
  /// the case that none of the messages are valid.
  /// @return The commitment to the state leaves and the ballots
  function currentSbCommitment() external view returns (uint256);

  /// @notice Get the dynamic depth of the state tree at the time of poll
  /// finalization (based on the number of leaves inserted)
  function actualStateTreeDepth() external view returns (uint8);

  /// @notice Get the external contracts
  /// @return maci The IMACI contract
  function getMaciContract() external view returns (IMACI maci);
}
