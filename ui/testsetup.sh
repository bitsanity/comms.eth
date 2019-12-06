#!/bin/bash

# must match ganache setup
TESTACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38'
TESTACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349'
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
# keccak256('blabb')
BLABB='0xef1e40075fa353271cd5af0085582dc3d22cb1d380f4a0adcd9b2f28af0ad028'
# namehash blabb.eth
BLABBETH='0xc40578c3ef0b4a0ecb769ccacb876251a3693cc47d8def2ea5e4cd3411795e77'

echo CONFIRM is ganache running?:
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  echo ""
  echo Please run the following before this:
  echo ""
  echo -n ganache-cli ""
  echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
  echo --account=\"$TESTPVTB,100000000000000000000\" ""
  echo ""
  exit
fi

echo
echo deploying ReverseRegistrar mock ...
pushd ../ethereum/revregmock
node ./cli.js 0 0 deploy
popd
sleep 1

echo
echo deploying ENS mock ...
pushd ../ethereum/ensmock
node ./cli.js 0 0 deploy $RVR
popd
sleep 1

echo
echo deploying Resolver ...
pushd ../ethereum/resolver
node ./cli.js 0 0 deploy $ENS
popd
sleep 1

echo
echo deploying ERC20Mock ...
pushd ../ethereum/erc20mock
node ./cli.js 0 0 deploy
popd
sleep 1

echo
echo deploying Registrar ...
pushd ../ethereum/registrar
node ./cli.js 0 0 deploy $ENS $RSV $BLABBETH
popd

echo
echo explicitly give ownership of blabb.eth to $REG
pushd ../ethereum/ensmock
node ./cli.js 0 $ENS setSubnodeOwner $ETH $BLABB $REG
popd

