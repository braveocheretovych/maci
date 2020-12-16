// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.7.2;

import {
    Poll,
    PollFactory,
    PollProcessor,
    MessageAqFactory
} from "./Poll.sol";
import { IMACI } from "./IMACI.sol";
import { Params } from "./Params.sol";
import { DomainObjs } from "./DomainObjs.sol";
import { VkRegistry } from "./VkRegistry.sol";
import { SnarkCommon } from "./crypto/SnarkCommon.sol";
import { SnarkConstants } from "./crypto/SnarkConstants.sol";
import { AccQueueQuinaryMaci } from "./trees/AccQueue.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SignUpGatekeeper } from "./gatekeepers/SignUpGatekeeper.sol";
import { InitialVoiceCreditProxy }
    from "./initialVoiceCreditProxy/InitialVoiceCreditProxy.sol";

/*
 * Minimum Anti-Collusion Infrastructure
 * Version 1
 */
contract MACI is IMACI, DomainObjs, Params, SnarkConstants, SnarkCommon, Ownable {
    // The state tree depth is fixed. As such it should be as large as feasible
    // so that there can be as many users as possible.  i.e. 5 ** 10 = 9765625
    uint8 public override stateTreeDepth = 10;

    // IMPORTANT: remember to change the spent voice credits tree in Poll.sol
    // if we change the state tree depth!

    uint8 constant internal STATE_TREE_SUBDEPTH = 2;
    uint8 constant internal STATE_TREE_ARITY = 5;

    // Each poll has an incrementing ID
    uint256 internal nextPollId = 0;

    // A mapping of poll IDs to Poll contracts.
    mapping (uint256 => Poll) public polls;

    // A mapping of block timestamps to state roots
    mapping (uint256 => uint256) public stateRootSnapshots;

    // The block timestamp at which the state queue subroots were last merged
    uint256 public mergeSubRootsTimestamp;

    // The verifying key registry. There may be multiple verifying keys stored
    // on chain, and Poll contracts must select the correct VK based on the
    // circuit's compile-time parameters, such as tree depths and batch sizes.
    VkRegistry public override vkRegistry;

    PollFactory public pollFactory;
    MessageAqFactory public messageAqFactory;

    // The state AccQueue. Represents a mapping between each user's public key
    // and their voice credit balance.
    AccQueueQuinaryMaci public stateAq;

    // Whether the init() function has been successfully executed yet.
    bool isInitialised = false;

    // Address of the SignUpGatekeeper, a contract which determines whether a
    // user may sign up to vote
    SignUpGatekeeper public signUpGatekeeper;

    // The contract which provides the values of the initial voice credit
    // balance per user
    InitialVoiceCreditProxy public initialVoiceCreditProxy;

    event SignUp(
        uint256 _stateIndex,
        PubKey _userPubKey,
        uint256 _voiceCreditBalance
    );
    event DeployPoll(uint256 _pollId, address _pollAddr);

    constructor(
        PollFactory _pollFactory,
        SignUpGatekeeper _signUpGatekeeper,
        InitialVoiceCreditProxy _initialVoiceCreditProxy
    ) {
        // Deploy the state AccQueu
        stateAq = new AccQueueQuinaryMaci(STATE_TREE_SUBDEPTH);

        pollFactory = _pollFactory;
        signUpGatekeeper = _signUpGatekeeper;
        initialVoiceCreditProxy = _initialVoiceCreditProxy;
    }

    /*
     * Initialise the various helper contracts. This should only be run once
     * and it must be run before deploying the first Poll.
     */
    function init(
        VkRegistry _vkRegistry,
        MessageAqFactory _messageAqFactory
    ) public onlyOwner {
        require(isInitialised == false, "MACI: already initialised");

        vkRegistry = _vkRegistry;
        messageAqFactory = _messageAqFactory;

        // Check that the factory contracts have correct access controls before
        // allowing any functions in MACI to run (via the afterInit modifier)
        require(
            pollFactory.owner() == address(this),
            "MACI: PollFactory owner incorrectly set"
        );

        // The PollFactory needs to store the MessageAqFactory address
        pollFactory.setMessageAqFactory(messageAqFactory);

        // The MessageAQFactory owner must be the PollFactory contract
        require(
            messageAqFactory.owner() == address(pollFactory),
            "MACI: MessageAqFactory owner incorrectly set"
        );

        // The VkRegistry owner must be the owner of this contract
        require(
            vkRegistry.owner() == owner(),
            "MACI: VkRegistry owner incorrectly set"
        );

        isInitialised = true;
    }

    modifier afterInit() {
        require(isInitialised == true, "MACI: not initialised");
        _;
    }

    /*
     * Allows any eligible user sign up. The sign-up gatekeeper should prevent
     * double sign-ups or ineligible users from doing so.  This function will
     * only succeed if the sign-up deadline has not passed. It also enqueues a
     * fresh state leaf into the state AccQueue.
     * @param _userPubKey The user's desired public key.
     * @param _signUpGatekeeperData Data to pass to the sign-up gatekeeper's
     *     register() function. For instance, the POAPGatekeeper or
     *     SignUpTokenGatekeeper requires this value to be the ABI-encoded
     *     token ID.
     * @param _initialVoiceCreditProxyData Data to pass to the
     *     InitialVoiceCreditProxy, which allows it to determine how many voice
     *     credits this user should have.
     */
    function signUp(
        PubKey memory _pubKey,
        bytes memory _signUpGatekeeperData,
        bytes memory _initialVoiceCreditProxyData
    ) public afterInit {

        // Register the user via the sign-up gatekeeper. This function should
        // throw if the user has already registered or if ineligible to do so.
        signUpGatekeeper.register(msg.sender, _signUpGatekeeperData);

        require(
            _pubKey.x < SNARK_SCALAR_FIELD && _pubKey.y < SNARK_SCALAR_FIELD,
            "MACI: _pubKey values should be less than the snark scalar field"
        );

        // Get the user's voice credit balance.
        uint256 voiceCreditBalance = initialVoiceCreditProxy.getVoiceCredits(
            msg.sender,
            _initialVoiceCreditProxyData
        );

        // The limit on voice credits is 2 ^ 32 which is hardcoded into the
        // UpdateStateTree circuit, specifically at check that there are
        // sufficient voice credits (using GreaterEqThan(32)).
        // TODO: perhaps increase this to 2 ^ 50 = 1125899906842624?
        require(
            voiceCreditBalance <= 4294967296,
            "MACI: too many voice credits"
        );

        // Create a state leaf and enqueue it.
        uint256 stateLeaf = hashStateLeaf(
            StateLeaf(_pubKey, voiceCreditBalance)
        );
        uint256 stateIndex = stateAq.enqueue(stateLeaf);

        emit SignUp(stateIndex, _pubKey, voiceCreditBalance);
    }

    //function signUpViaRelayer(
        //MaciPubKey memory pubKey,
        //bytes memory signature,
        // uint256 nonce
    //) public {
        //// TODO: validate signature and sign up
    //)

    function mergeStateAqSubRoots(uint256 _numSrQueueOps)
    public
    onlyOwner
    afterInit {
        stateAq.mergeSubRoots(_numSrQueueOps);
        mergeSubRootsTimestamp = block.timestamp;
    }

    function mergeStateAq()
    public
    onlyOwner
    afterInit {
        uint256 root = stateAq.merge(stateTreeDepth);
        stateRootSnapshots[mergeSubRootsTimestamp] = root;
        mergeSubRootsTimestamp = 0;
    }

    function getStateRootSnapshot(uint256 _timestamp)
    external
    view
    override
    returns (uint256) {
        uint256 root = stateRootSnapshots[_timestamp];

        require(
            root != 0,
            "MACI: no such state root snapshot at this timestamp"
        );

        return root;
    }

    /*
     * Deploy a new Poll contract.
     */
    function deployPoll(
        uint256 _duration,
        MaxValues memory _maxValues,
        TreeDepths memory _treeDepths,
        uint8 _messageBatchSize,
        PubKey memory _coordinatorPubKey,
        PollProcessor _pollProcessor
    ) public afterInit {
        uint256 pollId = nextPollId;

        // The message batch size and the tally batch size
        BatchSizes memory batchSizes = BatchSizes(
            _messageBatchSize,
            STATE_TREE_ARITY ** uint8(_treeDepths.intStateTreeDepth)
        );

        Poll p = pollFactory.deploy(
            _duration,
            stateTreeDepth,
            _maxValues,
            _treeDepths,
            batchSizes,
            _coordinatorPubKey,
            vkRegistry,
            this,
            owner(),
            _pollProcessor
        );

        polls[pollId] = p;

        // Increment the poll ID for the next poll
        nextPollId ++;

        emit DeployPoll(pollId, address(p));
    }

    function getPoll(uint256 _pollId) public view returns (Poll) {
        require(
            _pollId < nextPollId,
            "MACI: poll with _pollId does not exist"
        );
        return polls[_pollId];
    }
}
