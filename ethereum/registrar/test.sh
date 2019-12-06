#!/bin/bash

# ganache setup
TESTACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38'
TESTACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349'
BOGUS='0x0123456789abcdef0123456789abcdef01234567'
TESTPVTA='0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a'
TESTPVTB='0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7'

# contract SCA's - must be done in order from fresh ganache start
RVR='0xf68580c3263fb98c6eaee7164afd45ecf6189ebb'
ENS='0x4ebf4321a360533ac2d48a713b8f18d341210078'
RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0'
TOK='0xdbb97b008f97895a4f38a7f00e9c2b78a4bc5941'
REG='0x3b9b02d76cc7a327adf99255fe39558089614937'

# namehash('eth')
ETH='0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'
# keccak256('alice')
ALICE='0x9c0257114eb9399a2985f8e75dad7600c5d89fe3824ffa99ec1c3eb8bf3b0501'
# namehash alice.eth
ALICEETH='0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec'

echo CONFIRM is ganache running?:
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  echo ""
  echo Please run the following before this:
  echo ""
  echo -n ganache-cli ""
  echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
  echo -n --account=\"$TESTPVTB,100000000000000000000\" ""
  echo  --account=\"$TESTPVTC,100000000000000000000\"
  echo ""
  exit
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
  pushd ../resolver
  node ./cli.js 0 0 deploy $ENS
  popd
  sleep 1

  echo
  echo deploying ERC20Mock ...
  pushd ../erc20mock
  node ./cli.js 0 0 deploy
  popd
  sleep 1

  echo
  echo deploying Registrar ...
  node ./cli.js 0 0 deploy $ENS $RSV $ALICEETH

  echo
  echo explicitly give ownership of alice.eth to $REG
  pushd ../ensmock
  node ./cli.js 0 $ENS setSubnodeOwner $ETH $ALICE $REG
  popd
fi

echo
echo run tests? :
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  exit
fi

echo should fail: register \"bob\" under node \"alice.eth\" without paying
node cli.js 0 $REG registerLabel bob $BOGUS 0
echo

echo register label \"bob\" under node \"alice.eth\"
node cli.js 0 $REG registerLabel bob $TESTACCTA 50000000000000
echo

echo should fail: someone else tries to register \"bob\"
node cli.js 1 $REG registerLabel bob $TESTACCTB 50000000000000
echo

echo should fail: register \"charlene\" with a public key, without paying
node cli.js 1 $REG registerLabelAndKey charlene $TESTPVTA $TESTPVTB $TESTACCTB 0
echo

echo register label \"charlene\" with a public key
node cli.js 1 $REG registerLabelAndKey \
  charlene $TESTPVTA $TESTPVTB $TESTACCTB 100000000000000
echo

echo should fail: someone else tries to register \"charlene\" with a public key
node cli.js 0 $REG registerLabelAndKey charlene \
  $TESTPVTB $TESTPVTA $TESTACCTA 100000000000000
echo

echo should fail: try to register a new topic without paying
node cli.js 0 $REG registerTopic capricorn $TESTACCTB 0
echo

echo register a new topic
node cli.js 0 $REG registerTopic capricorn $TESTACCTA 1000000000000000
echo

echo should fail: someone else tries to register the topic
node cli.js 1 $REG registerTopic capricorn $TESTACCTB 1000000000
echo

echo send 0.1 test eth to our smart contract
node pay.js 0 $REG 100000000000000000
echo ... and sweep it right back
node cli.js 0 $REG sweepEther
echo

echo sweep nonexistent token balance from mock ERC20
node cli.js 0 $REG sweepToken $TOK
pushd ../erc20mock
node cli.js 0 $TOK events
popd
echo

echo should fail: someone other than beneficiary tries to set a new Resolver
node cli.js 1 $REG setResolver $TESTACCTB
echo

echo beneficiary sets new Resolver
node cli.js 0 $REG setResolver "0x0123456789012345678901234567890123456789"
echo

echo change beneficiary
node cli.js 0 $REG changeBeneficiary $TESTACCTB
echo

echo variables
node cli.js 0 $REG variables
echo

echo events
node cli.js 0 $REG events
exit

