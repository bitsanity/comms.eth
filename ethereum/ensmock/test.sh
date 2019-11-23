#!/bin/bash

TESTACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38'
TESTACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349'
TESTPVTA='0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a'
TESTPVTB='0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7'
SCA='0xF68580C3263FB98C6EAeE7164afD45Ecf6189EbB'
RVR='0x0000000000000000000000000000000000000001'

echo CONFIRM running:
echo ""
echo -n ganache-cli ""
echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
echo -n --account=\"$TESTPVTB,100000000000000000000\" ""
echo ""
echo ""
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  echo ""
  echo Please run the following before this:
  echo ""
  exit
fi

echo "deploy ENSMock?"
read -p '[N/y]: ' ans
if [[ $ans == "y" || $ans == "Y" ]]; then
  node cli.js 0 0 deploy $RVR
fi
echo ""

echo "run tests?"
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  exit
fi

echo 'namehashes:'
NODE=`node cli.js 0 0 namehash alice.eth`
echo '  alice.eth :' $NODE
# LABEL is keccak256('bob')
LABEL='0x38e47a7b719dce63662aeaf43440326f551b8a7ee198cee35cb5d517f2d296a2'

echo '  bob :' $LABEL
FQNAME=`node cli.js 0 0 namehash bob.alice.eth`
echo '  bob.alice.eth :' $FQNAME

echo ""
echo set TESTACCTB as owner of $FQNAME
node cli.js 0 $SCA setSubnodeOwner $NODE $LABEL $TESTACCTB
echo ""

echo owner of addr.reverse node is the reverse registrar
node cli.js 0 $SCA owner \
  "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
echo ""

echo who owns name $FQNAME
node cli.js 0 $SCA owner $FQNAME
echo ""

echo "Events"
node cli.js 0 $SCA events
echo ""

