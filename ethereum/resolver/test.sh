#!/bin/bash

# ganache setup
TESTACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38'
TESTACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349'
TESTPVTA='0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a'
TESTPVTB='0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7'

# contract SCA's - must be done in order from fresh ganache start
RVR='0xf68580c3263fb98c6eaee7164afd45ecf6189ebb'
ENS='0x4ebf4321a360533ac2d48a713b8f18d341210078'
RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0'
TOK='0xdbb97b008f97895a4f38a7f00e9c2b78a4bc5941'

# namehash('eth')
ETH='0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'
# keccak256('alice')
ALICE='0x9c0257114eb9399a2985f8e75dad7600c5d89fe3824ffa99ec1c3eb8bf3b0501'
# namehash alice.eth
ALICEETH='0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec'

echo run ganache? :
read -p '[N/y]: ' ans
if [[ $ans == "y" || $ans == "Y" ]]; then
  ganache-cli --account=$TESTPVTA,100000000000000000000 \
              --account=$TESTPVTB,100000000000000000000 &
  echo
fi

echo deploy contracts? :
read -p '[N/y]: ' ans
if [[ $ans == "y" || $ans == "Y" ]]; then
  echo
  echo deploying ReverseRegistrar mock ...
  pushd ../revregmock
  node ./cli.js 0 0 deploy
  popd
  sleep 1

  echo
  echo deploying ENS mock ...
  pushd ../ensmock
  node ./cli.js 0 0 deploy $RVR
  popd
  sleep 1

  echo
  echo deploying Resolver ...
  node ./cli.js 0 0 deploy $ENS
  sleep 1

  echo
  echo deploying ERC20Mock ...
  pushd ../erc20mock
  node ./cli.js 0 0 deploy
  popd
  sleep 1
fi

echo
echo run tests? :
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  exit
fi

echo variables
node cli.js 0 $RSV variables
echo
echo
echo declares support for addr interface
node cli.js 0 $RSV supportsInterface "0x3b3b57de"
echo
echo declares support for pubkey interface
node cli.js 0 $RSV supportsInterface "0xc8690233"
echo
echo does NOT declare support for bogus hash
node cli.js 0 $RSV supportsInterface "0x12345678"
echo

echo set ownership of alice.eth to $TESTACCTA
pushd ../ensmock
node ./cli.js 0 $ENS setSubnodeOwner $ETH $ALICE $TESTACCTA
popd
echo

echo set address for alice.eth to $TESTACCTB
node cli.js 0 $RSV setAddr $ALICEETH $TESTACCTB
echo ... and gets the same result
node cli.js 0 $RSV addr $ALICEETH
echo

echo set a bogus pubkey for alice.eth
node cli.js 0 $RSV setPubkey $ALICEETH $TESTPVTA $TESTPVTB
echo ... and gets the same result
node cli.js 0 $RSV pubkey $ALICEETH
echo

echo send 0.1 test eth to our smart contract
node pay.js 0 $RSV 100000000000000000
echo ... and sweep it right back
node cli.js 0 $RSV sweepEther
echo

echo sweep nonexistent token balance from mock ERC20
node cli.js 0 $RSV sweepToken $TOK
pushd ../erc20mock
node cli.js 0 $TOK events
popd
echo

echo change beneficiary
node cli.js 0 $RSV changeBeneficiary $TESTACCTB
node cli.js 0 $RSV variables

echo all the events from the above tests...
node cli.js 0 $RSV events
echo

