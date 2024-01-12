"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6485],{8425:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var s=n(5250),i=n(2459);const r={title:"MACI Smart Contracts",description:"MACI is composed of multiple smart contracts, which together with the zk-SNARK circuits, can be used to carry out on-chain voting",sidebar_label:"Smart Contracts",sidebar_position:6},o="Smart Contracts",a={id:"contracts",title:"MACI Smart Contracts",description:"MACI is composed of multiple smart contracts, which together with the zk-SNARK circuits, can be used to carry out on-chain voting",source:"@site/versioned_docs/version-v1.x/contracts.md",sourceDirName:".",slug:"/contracts",permalink:"/docs/contracts",draft:!1,unlisted:!1,editUrl:"https://github.com/privacy-scaling-explorations/maci/edit/dev/website/versioned_docs/version-v1.x/contracts.md",tags:[],version:"v1.x",sidebarPosition:6,frontMatter:{title:"MACI Smart Contracts",description:"MACI is composed of multiple smart contracts, which together with the zk-SNARK circuits, can be used to carry out on-chain voting",sidebar_label:"Smart Contracts",sidebar_position:6},sidebar:"version-1.x/mySidebar",previous:{title:"Command-line interface",permalink:"/docs/cli"},next:{title:"Circuits",permalink:"/docs/circuits"}},c={},l=[{value:"MACI.sol",id:"macisol",level:2},{value:"Poll.sol",id:"pollsol",level:2},{value:"PollFactory.sol",id:"pollfactorysol",level:2},{value:"PollProcessorAndTallyer",id:"pollprocessorandtallyer",level:2},{value:"MessageAqFactory",id:"messageaqfactory",level:2},{value:"SignUpToken",id:"signuptoken",level:2},{value:"SignUpGatekeeper",id:"signupgatekeeper",level:2},{value:"VoiceCreditProxy",id:"voicecreditproxy",level:2},{value:"Hasher",id:"hasher",level:2},{value:"VkRegistry",id:"vkregistry",level:2},{value:"Params",id:"params",level:2},{value:"AccQueue",id:"accqueue",level:2},{value:"EmptyBallotRoots",id:"emptyballotroots",level:2}];function h(e){const t={annotation:"annotation",code:"code",h1:"h1",h2:"h2",li:"li",math:"math",mn:"mn",mo:"mo",mrow:"mrow",ol:"ol",p:"p",pre:"pre",semantics:"semantics",span:"span",ul:"ul",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"smart-contracts",children:"Smart Contracts"}),"\n",(0,s.jsx)(t.p,{children:"MACI is composed of multiple smart contracts, which together with the zk-SNARK circuits, can be used to carry out on-chain voting."}),"\n",(0,s.jsx)(t.p,{children:"The main contracts are presented and explained below."}),"\n",(0,s.jsx)(t.h2,{id:"macisol",children:"MACI.sol"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"MACI.sol"})," is the core contract of the project, as it provides the base layer for user signups and Polls to be created."]}),"\n",(0,s.jsxs)(t.p,{children:["The constructor shown below accepts three arguments, a ",(0,s.jsx)(t.code,{children:"PollFactory"})," contract, a ",(0,s.jsx)(t.code,{children:"SignUpGatekeeper"})," contract, and an ",(0,s.jsx)(t.code,{children:"InitialVoiceCreditProxy"})," contract."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'constructor(\n    PollFactory _pollFactory,\n    SignUpGatekeeper _signUpGatekeeper,\n    InitialVoiceCreditProxy _initialVoiceCreditProxy\n) {\n    // Deploy the state AccQueue\n    stateAq = new AccQueueQuinaryBlankSl(STATE_TREE_SUBDEPTH);\n    stateAq.enqueue(BLANK_STATE_LEAF_HASH);\n\n    pollFactory = _pollFactory;\n    signUpGatekeeper = _signUpGatekeeper;\n    initialVoiceCreditProxy = _initialVoiceCreditProxy;\n\n    // Verify linked poseidon libraries\n    require(\n        hash2([uint256(1), uint256(1)]) != 0,\n        "MACI: poseidon hash libraries not linked"\n    );\n}\n'})}),"\n",(0,s.jsxs)(t.p,{children:["Upon deployment, the contract will deploy a new ",(0,s.jsx)(t.code,{children:"AccQueueQuinaryBlankSl"})," contract using the ",(0,s.jsx)(t.code,{children:"STATE_TREE_SUBDEPTH"}),". By default, this is defined as ",(0,s.jsx)(t.code,{children:"uint8 internal constant STATE_TREE_SUBDEPTH = 2;"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["Should this be changed, it will be necessary to amend the ",(0,s.jsx)(t.code,{children:"contracts/ts/genEmptyBallotRootsContract.ts"})," file to reflect the change. The first action on this deployed contract, is to enqueue (add) an empty hash (defined as ",(0,s.jsx)(t.code,{children:"6769006970205099520508948723718471724660867171122235270773600567925038008762"}),")."]}),"\n",(0,s.jsx)(t.p,{children:"After this, the contracts will be stored to state, the current time taken and then the contract will perform a simple sanity check to ensure that the Poseidon hash libraries were linked successfully."}),"\n",(0,s.jsxs)(t.p,{children:["Once the contract is deployed, the owner (set as the deployer address of MACI), is required to call the ",(0,s.jsx)(t.code,{children:"init"})," function, which is shown below:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'function init(\n    VkRegistry _vkRegistry,\n    MessageAqFactory _messageAqFactory,\n    TopupCredit _topupCredit\n    ) public onlyOwner {\n    require(!isInitialised, "MACI: already initialised");\n\n    isInitialised = true;\n\n    vkRegistry = _vkRegistry;\n    messageAqFactory = _messageAqFactory;\n    topupCredit = _topupCredit;\n\n    // Check that the factory contracts have correct access controls before\n    // allowing any functions in MACI to run (via the afterInit modifier)\n    require(\n        pollFactory.owner() == address(this),\n        "MACI: PollFactory owner incorrectly set"\n    );\n\n    // The PollFactory needs to store the MessageAqFactory address\n    pollFactory.setMessageAqFactory(messageAqFactory);\n\n    // The MessageAQFactory owner must be the PollFactory contract\n    require(\n        messageAqFactory.owner() == address(pollFactory),\n        "MACI: MessageAqFactory owner incorrectly set"\n    );\n\n    // The VkRegistry owner must be the owner of this contract\n    require(\n        vkRegistry.owner() == owner(),\n        "MACI: VkRegistry owner incorrectly set"\n    );\n\n    emit Init(_vkRegistry, _messageAqFactory);\n}\n'})}),"\n",(0,s.jsx)(t.p,{children:"This function accepts three arguments:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"VkRegistry"})," - the contract holding the verifying keys"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"MessageAqFactory"})," - the factory contract for deploying new MessageAq contracts"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"TopupCredit"})," - the contract responsible for topping up voting credits"]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["In more details, the ",(0,s.jsx)(t.code,{children:"init"})," function will check/do the following:"]}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["That the ",(0,s.jsx)(t.code,{children:"PollFactory"})," contract's owner has been set to be the ",(0,s.jsx)(t.code,{children:"MACI"})," contract"]}),"\n",(0,s.jsxs)(t.li,{children:["Set the ",(0,s.jsx)(t.code,{children:"messageAqFactory"})," contract on the ",(0,s.jsx)(t.code,{children:"pollFactory"})," contract"]}),"\n",(0,s.jsxs)(t.li,{children:["Check that the owner of the ",(0,s.jsx)(t.code,{children:"messageAqFactory"})," is the ",(0,s.jsx)(t.code,{children:"pollFactory"})," contract"]}),"\n",(0,s.jsxs)(t.li,{children:["Confirm that the ",(0,s.jsx)(t.code,{children:"vkRegistry"})," owner is the same as the ",(0,s.jsx)(t.code,{children:"MACI"})," owner"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Finally, it will emit an event."}),"\n",(0,s.jsxs)(t.p,{children:["Next, we have the ",(0,s.jsx)(t.code,{children:"signUp"})," function, which allows users to ",(0,s.jsx)(t.code,{children:"signUp"})," using a ",(0,s.jsx)(t.code,{children:"SignUpGatekeeper"})," contract. This contract can use any mean necessary to gatekeep access to MACI's polls. For instance, only wallets with access to a specific ERC721 token can be allowed to sign up. Please note that this function can only be called after the contract is initialized (thanks to the ",(0,s.jsx)(t.code,{children:"afterInit"})," modifier)."]}),"\n",(0,s.jsx)(t.p,{children:"This function does the following:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["checks that the maximum number of signups have not been reached. As of now, this will be ",(0,s.jsxs)(t.span,{className:"katex",children:[(0,s.jsx)(t.span,{className:"katex-mathml",children:(0,s.jsx)(t.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:(0,s.jsxs)(t.semantics,{children:[(0,s.jsxs)(t.mrow,{children:[(0,s.jsx)(t.mn,{children:"5"}),(0,s.jsx)(t.mo,{children:"\u2217"}),(0,s.jsx)(t.mo,{children:"\u2217"}),(0,s.jsx)(t.mn,{children:"10"}),(0,s.jsx)(t.mo,{children:"\u2212"}),(0,s.jsx)(t.mn,{children:"1"})]}),(0,s.jsx)(t.annotation,{encoding:"application/x-tex",children:"5 ** 10 - 1"})]})})}),(0,s.jsxs)(t.span,{className:"katex-html","aria-hidden":"true",children:[(0,s.jsxs)(t.span,{className:"base",children:[(0,s.jsx)(t.span,{className:"strut",style:{height:"0.6444em"}}),(0,s.jsx)(t.span,{className:"mord",children:"5"}),(0,s.jsx)(t.span,{className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.jsx)(t.span,{className:"mbin",children:"\u2217"}),(0,s.jsx)(t.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),(0,s.jsxs)(t.span,{className:"base",children:[(0,s.jsx)(t.span,{className:"strut",style:{height:"0.7278em",verticalAlign:"-0.0833em"}}),(0,s.jsx)(t.span,{className:"mord",children:"\u2217"}),(0,s.jsx)(t.span,{className:"mord",children:"10"}),(0,s.jsx)(t.span,{className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.jsx)(t.span,{className:"mbin",children:"\u2212"}),(0,s.jsx)(t.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),(0,s.jsxs)(t.span,{className:"base",children:[(0,s.jsx)(t.span,{className:"strut",style:{height:"0.6444em"}}),(0,s.jsx)(t.span,{className:"mord",children:"1"})]})]})]})," due to circuit limitations."]}),"\n",(0,s.jsx)(t.li,{children:"checks that the provided public key is within the allowed boundaries"}),"\n",(0,s.jsx)(t.li,{children:"increases the number of signups"}),"\n",(0,s.jsx)(t.li,{children:"registers the user using the sign up gatekeeper contract. It is important that whichever gatekeeper is used, it reverts if an user tries to sign up twice."}),"\n",(0,s.jsx)(t.li,{children:"calls the voice credit proxy to retrieve the number of allocated voice credits for the calling account"}),"\n",(0,s.jsx)(t.li,{children:"hashes the voice credits alongside the calling address and the current time"}),"\n",(0,s.jsxs)(t.li,{children:["enqueues this hashed data into the ",(0,s.jsx)(t.code,{children:"stateAq"})," contract"]}),"\n"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'function signUp(\n    PubKey memory _pubKey,\n    bytes memory _signUpGatekeeperData,\n    bytes memory _initialVoiceCreditProxyData\n) public afterInit {\n    // The circuits only support up to (5 ** 10 - 1) signups\n    require(\n        numSignUps < STATE_TREE_ARITY**stateTreeDepth,\n        "MACI: maximum number of signups reached"\n    );\n\n    require(\n        _pubKey.x < SNARK_SCALAR_FIELD && _pubKey.y < SNARK_SCALAR_FIELD,\n        "MACI: _pubKey values should be less than the snark scalar field"\n    );\n\n    // Increment the number of signups\n    numSignUps++;\n\n    // Register the user via the sign-up gatekeeper. This function should\n    // throw if the user has already registered or if ineligible to do so.\n    signUpGatekeeper.register(msg.sender, _signUpGatekeeperData);\n\n    // Get the user\'s voice credit balance.\n    uint256 voiceCreditBalance = initialVoiceCreditProxy.getVoiceCredits(\n        msg.sender,\n        _initialVoiceCreditProxyData\n    );\n\n    uint256 timestamp = block.timestamp;\n    // Create a state leaf and enqueue it.\n    uint256 stateLeaf = hashStateLeaf(\n        StateLeaf(_pubKey, voiceCreditBalance, timestamp)\n    );\n    uint256 stateIndex = stateAq.enqueue(stateLeaf);\n\n    emit SignUp(stateIndex, _pubKey, voiceCreditBalance, timestamp);\n}\n'})}),"\n",(0,s.jsxs)(t.p,{children:["Once everything has been setup, polls can be deployed using the ",(0,s.jsx)(t.code,{children:"deployPoll"})," function. This function is not protected by access control, therefore any user can deploy one. It should be noted however, that previous poll should have been closed out first, and this can only be done by the owner of the contract, which is the ",(0,s.jsx)(t.code,{children:"MACI"})," contract itself."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'function deployPoll(\n    uint256 _duration,\n    MaxValues memory _maxValues,\n    TreeDepths memory _treeDepths,\n    PubKey memory _coordinatorPubKey\n) public afterInit {\n    uint256 pollId = nextPollId;\n\n    // Increment the poll ID for the next poll\n    nextPollId++;\n\n    if (pollId > 0) {\n        require(\n            stateAq.treeMerged(),\n            "MACI: previous poll must be completed before using a new instance"\n        );\n    }\n\n    // The message batch size and the tally batch size\n    BatchSizes memory batchSizes = BatchSizes(\n        MESSAGE_TREE_ARITY**uint8(_treeDepths.messageTreeSubDepth),\n        STATE_TREE_ARITY**uint8(_treeDepths.intStateTreeDepth),\n        STATE_TREE_ARITY**uint8(_treeDepths.intStateTreeDepth)\n    );\n\n    Poll p = pollFactory.deploy(\n        _duration,\n        _maxValues,\n        _treeDepths,\n        batchSizes,\n        _coordinatorPubKey,\n        vkRegistry,\n        this,\n        topupCredit,\n        owner()\n    );\n\n    polls[pollId] = p;\n\n    emit DeployPoll(pollId, address(p), _coordinatorPubKey);\n}\n'})}),"\n",(0,s.jsx)(t.h2,{id:"pollsol",children:"Poll.sol"}),"\n",(0,s.jsx)(t.p,{children:"This contract allows users to vote on a Poll."}),"\n",(0,s.jsx)(t.p,{children:"The main functions of the contract are as follows:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"topup"})," - This function accepts two parameters, a ",(0,s.jsx)(t.code,{children:"stateIndex"}),", and an ",(0,s.jsx)(t.code,{children:"amount"}),". It can only be called before the voting deadline.\nAfter checking whether the deadline has passed or not, it will validate that the contract has not reached the maximum number of messages, if the checks passes, it will increase the number of messages by 1.\nIt will then try to transfer the amount of ",(0,s.jsx)(t.code,{children:"topUpCredit"})," tokens.\nFinally, it will create a new Message object that will be hashed and enqueued in the ",(0,s.jsx)(t.code,{children:"messageAq"})," contract. This messageAq contract is reserved for this one poll only and will only contain its messages."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"publishMessage"})," - This function allows anyone to publish a message, and it accepts the message object as well as an ephemeral public key. This key together with the coordinator public key will be used to generate a shared ECDH key that will encrypt the message.\nBefore saving the message, the function will check that the voting deadline has not passed, as well as the max number of messages was not reached."]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"mergeMaciStateAqSubRoots"})," function can be called by the contract admin after the voting deadline and looks like the following:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"function mergeMaciStateAqSubRoots(uint256 _numSrQueueOps, uint256 _pollId)\n    public\n    onlyOwner\n    isAfterVotingDeadline\n    {\n        // This function can only be called once per Poll\n        require(!stateAqMerged, ERROR_STATE_AQ_ALREADY_MERGED);\n\n        if (!extContracts.maci.stateAq().subTreesMerged()) {\n            extContracts.maci.mergeStateAqSubRoots(_numSrQueueOps, _pollId);\n        }\n\n        emit MergeMaciStateAqSubRoots(_numSrQueueOps);\n    }\n"})}),"\n",(0,s.jsxs)(t.p,{children:["If the subtrees have not been merged on the MACI contract's ",(0,s.jsx)(t.code,{children:"stateAq"}),", then it will merge it by calling ",(0,s.jsx)(t.code,{children:"mergeStateAqSubroots"}),". It accepts two parameters:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"_numSrQueueOps"})," - the number of operations required"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"_pollId"})," - the id of the poll"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"The next function, is presented below:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"function mergeMaciStateAq(uint256 _pollId)\n        public\n        onlyOwner\n        isAfterVotingDeadline\n    {\n        // This function can only be called once per Poll after the voting\n        // deadline\n        require(!stateAqMerged, ERROR_STATE_AQ_ALREADY_MERGED);\n\n        stateAqMerged = true;\n\n        require(\n            extContracts.maci.stateAq().subTreesMerged(),\n            ERROR_STATE_AQ_SUBTREES_NEED_MERGE\n        );\n\n        mergedStateRoot = extContracts.maci.mergeStateAq(_pollId);\n\n        // Set currentSbCommitment\n        uint256[3] memory sb;\n        sb[0] = mergedStateRoot;\n        sb[1] = emptyBallotRoots[treeDepths.voteOptionTreeDepth - 1];\n        sb[2] = uint256(0);\n\n        currentSbCommitment = hash3(sb);\n        emit MergeMaciStateAq(mergedStateRoot);\n    }\n"})}),"\n",(0,s.jsx)(t.p,{children:"This function only accepts one parameter, and can be called by the owner only, and after the voting deadline. The parameter is the pollId for which we want to perform the operation. This function can only be called once per poll, and it will check that the sub trees have been merged on MACI's AccQueue contract. Finally it will merge the whole AccQueue to generate the state root, and store the current commitment comprised of:"}),"\n",(0,s.jsx)(t.p,{children:"the Poseidon hash of the merkle root, an empty ballot root stored in the emptyBallotRoots mapping (shown below), and a zero."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"emptyBallotRoots[0] = uint256(6579820437991406069687396372962263845395426835385368878767605633903648955255);\nemptyBallotRoots[1] = uint256(9105453741665960449792281626882014222103501499246287334255160659262747058842);\nemptyBallotRoots[2] = uint256(14830222164980158319423900821611648302565544940504586015002280367515043751869);\nemptyBallotRoots[3] = uint256(12031563002271722465187541954825013132282571927669361737331626664787916495335);\nemptyBallotRoots[4] = uint256(5204612805325639173251450278876337947880680931527922506745154187077640790699);\n"})}),"\n",(0,s.jsxs)(t.p,{children:["In order for the ",(0,s.jsx)(t.code,{children:"processMessages"})," circuit to access the message root, the following two functions need to be called (only by the owner):"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"mergeMessageAqSubRoots"})," - merges the Poll's messages tree subroot"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"mergeMessageAq"})," - merges the Poll's messages tree"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"pollfactorysol",children:"PollFactory.sol"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"PollFactory"})," is a smart contract that is used to deploy new Polls. This is used by MACI inside the ",(0,s.jsx)(t.code,{children:"deployPoll"})," function. It only contains two functions:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"setMessageAqFactory"})," - owner only function which allows to set the address of the ",(0,s.jsx)(t.code,{children:"MessageAqFactory"})," (a contract used to deploy new AccQueue contracts)"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"deploy"})," - owner only function which allows to deploy a new Poll"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"The arguments required to deploy a new Poll are the following:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"uint256 _duration,\nMaxValues memory _maxValues,\nTreeDepths memory _treeDepths,\nBatchSizes memory _batchSizes,\nPubKey memory _coordinatorPubKey,\nVkRegistry _vkRegistry,\nIMACI _maci,\nTopupCredit _topupCredit,\naddress _pollOwner\n"})}),"\n",(0,s.jsx)(t.p,{children:"Upon deployment, the ownership of the messageAq contract will be transferred to the deployed poll, as well as the ownership of the new Poll contract be transferred to the poll owner, which in MACI is set as the owner of MACI."}),"\n",(0,s.jsx)(t.h2,{id:"pollprocessorandtallyer",children:"PollProcessorAndTallyer"}),"\n",(0,s.jsx)(t.p,{children:"This contract is used to prepare parameters for the zk-SNARK circuits as well as for verifying proofs. It should be deployed alongside MACI and ownership assigned to the coordinator."}),"\n",(0,s.jsx)(t.h2,{id:"messageaqfactory",children:"MessageAqFactory"}),"\n",(0,s.jsxs)(t.p,{children:["This is a simple factory contract which allows to deploy new ",(0,s.jsx)(t.code,{children:"AccQueueQuinaryMaci"})," contracts. It exposes one function, ",(0,s.jsx)(t.code,{children:"deploy"}),", which can only be called by the contract owner. After deployment of the contract, it will transfer its ownership to the same owner as the factory contract."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"contract MessageAqFactory is Ownable {\n    function deploy(uint256 _subDepth) public onlyOwner returns (AccQueue) {\n        AccQueue aq = new AccQueueQuinaryMaci(_subDepth);\n        aq.transferOwnership(owner());\n        return aq;\n    }\n}\n"})}),"\n",(0,s.jsx)(t.h2,{id:"signuptoken",children:"SignUpToken"}),"\n",(0,s.jsx)(t.p,{children:"This contract should be used by the SignUpGateKeeper to determine whether a user is allowed to register. The default contract provided with MACI is a simple ERC721 token. Coordinators can use this contract to mint a token for each of the participants in the voting process."}),"\n",(0,s.jsx)(t.h2,{id:"signupgatekeeper",children:"SignUpGatekeeper"}),"\n",(0,s.jsx)(t.p,{children:"MACI requires a signup gatekeeper to ensure that only designed users register. It is up to MACI's deployer how they wish to allow sign-ups, therefore they can implement their own GateKeeper. The repository comes with two presets:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"FreeForAllSignUpGatekeeper"})," - This allows anyone to signup on MACI."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"SignUpTokenGatekeeper"})," - This makes use of a ERC721 token to gatekeep the signup function."]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"An abstract contract to inherit from is also provided, with two function signatures as shown below:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"abstract contract SignUpGatekeeper {\n    function setMaciInstance(MACI _maci) public virtual {}\n    function register(address _user, bytes memory _data) public virtual {}\n}\n"})}),"\n",(0,s.jsxs)(t.p,{children:["The MACI contract will need to call ",(0,s.jsx)(t.code,{children:"register"})," inside the ",(0,s.jsx)(t.code,{children:"signUp"})," function."]}),"\n",(0,s.jsx)(t.h2,{id:"voicecreditproxy",children:"VoiceCreditProxy"}),"\n",(0,s.jsx)(t.p,{children:"The VoiceCreditProxy contract is used to assign voice credits to users. Whichever implementation should the MACI deployers use, this must implement a view function that returns the balance for a user, such as the one below:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"function getVoiceCredits(address _user, bytes memory _data) public virtual view returns (uint256) {}\n"})}),"\n",(0,s.jsx)(t.h2,{id:"hasher",children:"Hasher"}),"\n",(0,s.jsx)(t.p,{children:"This contract exposes methods to hash different number of parameters with the Poseidon hash."}),"\n",(0,s.jsx)(t.h2,{id:"vkregistry",children:"VkRegistry"}),"\n",(0,s.jsx)(t.p,{children:"The VkRegistry is a contract that holds the verifying keys for the zk-SNARK circuits. It holds three different sets of keys:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"processVks"})," - The keys for the processMessages circuit"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"tallyVks"})," - The keys for the tallyVotes circuit"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"subsidyVk"})," - The keys for the subsidy circuit"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Each circuit will have a signature which is its compile-time constants represented as a uint256."}),"\n",(0,s.jsx)(t.h2,{id:"params",children:"Params"}),"\n",(0,s.jsx)(t.p,{children:"A contract holding three structs:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-go",children:"struct TreeDepths {\n    uint8 intStateTreeDepth;\n    uint8 messageTreeSubDepth;\n    uint8 messageTreeDepth;\n    uint8 voteOptionTreeDepth;\n}\n\nstruct BatchSizes {\n    uint24 messageBatchSize;\n    uint24 tallyBatchSize;\n    uint24 subsidyBatchSize;\n}\n\nstruct MaxValues {\n    uint256 maxMessages;\n    uint256 maxVoteOptions;\n}\n"})}),"\n",(0,s.jsx)(t.p,{children:"These are stored separately to avoid a stack overlow error during compilation of the contracts using them."}),"\n",(0,s.jsx)(t.h2,{id:"accqueue",children:"AccQueue"}),"\n",(0,s.jsxs)(t.p,{children:["The AccQueue contract represents a Merkle Tree where each leaf insertion only updates a subtree. To obtain the main tree root, the subtrees must be merged together by the contract owner. This requires at least two operations, a ",(0,s.jsx)(t.code,{children:"mergeSubRoots"})," and a ",(0,s.jsx)(t.code,{children:"merge"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["The contract can be initialized to work as a traditional Merkle Tree (2 leaves per node) or a Quinary Tree (5 leaves per node). This can be achieved by passing either two or five as parameter to the constructor (",(0,s.jsx)(t.code,{children:"_hashLength"}),"). Any other values should not be accepted."]}),"\n",(0,s.jsx)(t.p,{children:"Below are presented the most important functions of the smart contract:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"enqueue"})," - Allows to add a leaf to the queue for the current subtree. Only one parameter is accepted and that is the leaf to insert."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"insertSubTree"})," - Admin only function which allows to insert a full subtree (batch enqueue)"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"mergeSubRoots"})," - Allows the contract owner to merge all of the subtrees to form the shortest possible tree. The argument ",(0,s.jsx)(t.code,{children:"_numSrQueueOps"})," can be used to perform the operation in multiple transactions (as this might trigger the block gas limit)."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"merge"})," - Allows the contract admin to form a main tree with the desired depth. The depth must fit all of the leaves."]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"emptyballotroots",children:"EmptyBallotRoots"}),"\n",(0,s.jsx)(t.p,{children:"This contract contains the roots of Ballot trees of five leaf configurations."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"emptyBallotRoots[0] = uint256(6579820437991406069687396372962263845395426835385368878767605633903648955255);\nemptyBallotRoots[1] = uint256(9105453741665960449792281626882014222103501499246287334255160659262747058842);\nemptyBallotRoots[2] = uint256(14830222164980158319423900821611648302565544940504586015002280367515043751869);\nemptyBallotRoots[3] = uint256(12031563002271722465187541954825013132282571927669361737331626664787916495335);\nemptyBallotRoots[4] = uint256(5204612805325639173251450278876337947880680931527922506745154187077640790699);\n"})})]})}function d(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},2459:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>o});var s=n(79);const i={},r=s.createContext(i);function o(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);