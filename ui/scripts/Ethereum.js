const WS_URL = "ws://localhost:8545"; // ganache
//const WS_URL = "ws://localhost:8546"; // geth

// PROD SCA's
//const ENS="0x314159265dd8dbb310642f98f50c066173c1259b"; // .eth registrar
//const RVR="0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069"; // reverse registrar
//const RRV='0x5fBb459C49BB06083C33109fA4f14810eC2Cf358'; // reverse resolver
//const REG='0x3b9b02d76cc7a327adf99255fe39558089614937'; // our registrar
//const RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0'; // our resolver

// GANACHE SCA's
const ENS='0x4ebf4321a360533ac2d48a713b8f18d341210078'; // .eth registrar
const RVR='0xf68580c3263fb98c6eaee7164afd45ecf6189ebb'; // reverse registrar
const REG='0x3b9b02d76cc7a327adf99255fe39558089614937'; // our registrar
const RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0'; // our resolver

var web3;

var ENSCon;
var RevRegCon;
var RevResolverCon;

var RegistarCon;
var ResolverCon;

function Ξconnect() {
  if (typeof web3 !== 'undefined')
    web3 = new Web3( web3.currentProvider );
  else
    web3 = new Web3( new Web3.providers.WebsocketProvider(WS_URL) );

  ENSCon = new web3.eth.Contract( JSON.parse(ENSABI), ENS );
  RevRegCon = new web3.eth.Contract( JSON.parse(RVRABI), RVR );
  RevRegCon.methods.defaultResolver().call()
  .then( (rsv) => {
    RevResolverCon = new web3.eth.Contract( JSON.parse(RRVABI), rsv );
  } )
  .catch( (err) => { console.log(err.toString()) } );

  RegistarCon = new web3.eth.Contract( JSON.parse(REGABI), REG );
  ResolverCon = new web3.eth.Contract( JSON.parse(RSVABI), RSV );
}

function ΞnameExists( nametocheck, cb ) {
  RegistarCon.getPastEvents( 'LabelRegistered',
    {fromBlock:0, toBlock:'latest'} )
  .then( (evts) => {

    for (let ii = 0; ii < evts.length; ii++) {
      if ( nametocheck.toLowerCase()
           == evts[ii].returnValues.label.toLowerCase() )
        cb( true );
    }

    RegistarCon.getPastEvents( 'TopicRegistered',
      {fromBlock:0, toBlock:'latest'} )
    .then( (evts) => {

      for (ii = 0; ii < evts.length; ii++) {
        if ( nametocheck.toLowerCase()
             == evts[ii].returnValues.topic.toLowerCase() )
          cb( true );
      }
    } )
    .catch( (err) => { console.log( err.toString() ); } );
  } )
  .catch( (err) => { console.log( err.toString() ); } );

  cb( false );
}

function ΞlistNamesForAccount( acct, cb ) {
  let result = [];

  RegistarCon.getPastEvents( 'LabelRegistered',
    { fromBlock: 0, filter: { owner: acct }, toBlock: 'latest' } )
  .then( (evts) => {
    for( ii = 0; ii < evts.length; ii++ ) {
      result.push( evts[ii].returnValues.label );
    }

    cb( result );
  } )
  .catch( (err) => { console.log( err.toString() ); } );
}

function ΞloadKey( acct, acctPass ) {
  let result = {};

  let keyObj = keythereum.importFromFile( acct );
  if (!keyObj) throw "can't get private key";

  result.privkey = keythereum.recover( acctPass, keyObj );

  let eckp = elliptic.keyFromPrivate( result.privkey, "hex" );
  result.pubkey = eckp.getPublic( "hex" );
  result.pubkeyx = web3.utils.bytesToHex( result.pubkey.slice(0,33) );
  result.pubkeyy = web3.utils.bytesToHex( result.pubkey.slice(33) );

  return result;
}

function ΞmakeName( acct, acctPass, newname, val, gasprice ) {

  // let key = ΞloadKey( acct, acctPass );
  // let x = key.pubkeyx; let y = key.pubkeyy;

  // 2. TEST - assumes ganache running with same preconfigured keys
  let ganachekeys = [
  {"priv":"0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a",
   "pubx":"0x1eb4c8b9283f1ed94b710435d943f64bb7fdbb2feeecdcff85c63da92e16975c",
   "puby":"0x2bacdbbf6bfefb1a2f9195e79466970496b8f2c218b3abb7379d8688ac4b3d7f",
   "addr":"0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38"},

  {"priv":"0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7",
   "pubx":"0xb2d696107d702c745f3df7c2455ad03c5b39067bdc8ad9a3e85a5a927189fed6",
   "puby":"0x27393f76cbacbbd7d9b70bc9b589cb19b53a38dc16e7541f74bcc54400563c7c",
   "addr":"0x147b61187f3f16583ac77060cbc4f711ae6c9349"}
  ];
  let ix = 0;
  if (acct.toLowerCase() != ganachekeys[0].addr) {
    ix = 1;
  }
  let x = ganachekeys[ix].pubx;
  let y = ganachekeys[ix].puby;

  web3.eth.personal.unlockAccount( acct, acctPass, 100 /* seconds */ )
  .then( () => {

    RegistarCon.methods.registerLabelAndKey(
       newname,
       web3.utils.hexToBytes(x), web3.utils.hexToBytes(y),
       acct )
    .send( {from: acct, value: val, gas: 150000, gasPrice: gasprice} )
    .catch( err => { console.log(err.toString()) } );

    RevRegCon.methods.setName( newname + STRINGS[LANG].DAppNamespace )
    .send( {from: acct, gas: 150000, gasPrice: gasprice} )
    .catch( err => { console.log(err.toString()) } );

  } );
}

function ΞmakeTopic( acct, acctPass, newtop, val, gasprice ) {
  web3.eth.personal.unlockAccount( acct, acctPass, 100 /* seconds */ )
  .then( () => {

    RegistarCon.methods.registerTopic( newtop, acct )
    .send( {from: acct, value: val, gas: 150000, gasPrice: gasprice} )
    .catch( err => { console.log(err.toString()) } );

  } );
}

function ΞnetworkGasPrice( cb ) {
  web3.eth.getGasPrice()
  .then( res => { cb( res / 1e09 ); } )
  .catch( (err) => { console.log( err ); } );
}

function ΞlistTopics( cb ) {
  let result = ['']; // one blank, meaning null or no-topic

  RegistarCon.getPastEvents( 'TopicRegistered',
    {fromBlock: 0, toBlock: 'latest'} )
  .then( (evts) => {
    for( ii = 0; ii < evts.length; ii++ ) {
      result.push( evts[ii].returnValues.topic );
    }

    cb( result );
  } )
  .catch( (err) => { console.log( err.toString() ); } );
}

//
// TODO need a more efficient way to query the blockchain for transactions
//
async function
ΞretrieveMessages( blockstogoback, toaddr, totopic, fromaddr, keywords, cb ) {

  let result = [];

  let toval = '';
  if ( ΞisAddress(toaddr) )
    toval = toaddr;
  else {
    toval = await ΞnameToAddress( totopic );
  }

  let usefrom = ΞisAddress( fromaddr );
  let blocknum = await web3.eth.getBlockNumber();
  let fromblock =
    (blocknum > blockstogoback) ? (blocknum - blockstogoback) : blocknum;

  for( let ii = fromblock; ii <= blocknum; ii++ ) {
    let blk = await web3.eth.getBlock( ii, /* returnTxObs = */ true );

    for( let jj = 0; jj < blk.transactions.length; jj++ ) {
      if (    usefrom && (fromaddr == blk.transactions[jj].from)
           || toval == blk.transactions[jj].to ) {

        if (    !blk.transactions[jj].input
             || blk.transactions[jj].input == 0 )
          continue;

        let data = web3.utils.hexToUtf8( blk.transactions[jj].input )

        // keyword search
        if (keywords && keywords.length > 0) {
          let parts = keywords.split( /\s/ );
          let found = false;
          for (let kk = 0; kk < parts.length; kk++) {
            if ( data.includes(parts[kk]) )
              found = true;
          }
          if (!found) continue; // next transaction jj
        }

        result.push( {  hash:blk.transactions[jj].hash,
                       block:blk.transactions[jj].blockNumber,
                        from:blk.transactions[jj].from,
                          to:blk.transactions[jj].to,
                       input:data } );
      }
    }
  }
  cb( result );

}

async function ΞpostMessage( toaddr, acct, acctPass, val, messagehex ) {

  if (    !isAddress(toaddr)
       || !acct
       || !isAddress(acct)
       || !acctPass
       || acctPass.length == 0
       || !messagehex
       || messagehex.length == 0) {
    console.log( 'invalid args' );
    return;
  }

  web3.eth.personal.unlockAccount( acct, acctPass, 100 /* seconds */ )
  .then( () => {

    let valopt = '0'; if (val && val.length != 0) valopt = val;

    web3.eth.sendTransaction(
      {from: acct, to: toaddr, value: valopt, data: messagehex} )
    .then( () => { console.log( 'tx sent ') } )
    .catch( err => { console.log(err.toString()) } );

  } )
  .catch( err => { console.log(err.toString()) } );
}

async function ΞnameToAddress( name, cb ) {
  let node = namehash.hash( name );

  let resvaddr = await ENSCon.methods.resolver( node );
  if (!ΞisAddress(resvaddr)) return;

  let resvcon = new web3.eth.Contract( JSON.parse(RSVABI), resvaddr );
  let result = await resvcon.methods.addr( node );

  if (ΞisAddress(result)) {
    if (cb) cb( result );
    else
      return result;
  }
}

function ΞaddressToName( hash, addr, cb ) {
  RevResolverCon.methods.name( addr ).then( (res) => {
    cb( hash, name );
  } );
}

async function ΞgetPublicKey( hash, fqname, cb ) {
  if ( !fqname || fqname.length == 0 || !fqname.endsWith('.eth') ) return;

  let node = namehash.hash( fqname );
  let resaddr = await ENSCon.methods.resolver( node );
  if (!ΞisAddress(resaddr)) return;

  let rescon = new web3.eth.Contract( JSON.parse(RSVABI), resaddr );
  let pubkeyxy = await resolvercon.methods.pubkey( node );

  if (null != pubkeyxy)
    cb( hash, pubkeyxy );
}

function Ξkeccak( something ) {
  return web3.utils.sha3( something );
}

function ΞweiToEth( amtofwei ) {
  return web3.utils.fromWei( amtofwei, 'ether' );
}

function ΞisAddress( sca )
{
  const deny = /[^0x123456789abcdefABCDEF]/;

  return    null != sca
         && sca.startsWith("0x")
         && !deny.test(sca)
         && sca.length == 42;
}

function ΞpadLeft( addr ) {
  var n = addr.toString(16).replace(/^0x/, '');
  while (n.length < 64)
    n = "0" + n;

  return "0x" + n;
}

function ΞisAddr( addr )
{
  const deny = /[^0x123456789abcdefABCDEF]/;
  return addr.startsWith("0x")
         && !deny.test(addr)
         && addr.length == 42;
}

function ΞbytesToHex( bytes ) {
  return web3.utils.bytesToHex( bytes );
}

function ΞhexToBytes( hexstr ) {
  return web3.utils.hexToBytes( hexstr );
}

function ΞhexToUtf( hexstr ) {
  return web3.utils.hexToUtf8( hexstr );
}

async function Ξbalance( acct ) {
  return await web3.eth.getBalance( acct );
}

function ΞlocalAccounts( cb ) {
  web3.eth.getAccounts()
  .then( arr => {
    cb( arr );
  } )
  .catch( (err) => { console.log( err.toString() ); } );
}

const ENSABI = '[{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]';

const RVRABI = '[{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"resolver","type":"address"}],"name":"claimWithResolver","outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"claim","outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"defaultResolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"node","outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"setName","outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"},{"name":"resolverAddr","type":"address"}],"payable":false,"type":"constructor"}]';

const RRVABI = '[{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"}],"payable":false,"type":"constructor"}]';

const REGABI = '[{"constant":false,"inputs":[{"internalType":"address","name":"_erc20","type":"address"}],"name":"sweepToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_label","type":"string"},{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerLabelAndKey","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"theENS","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_topic","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerTopic","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"sweepEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myResolver","outputs":[{"internalType":"contract Resolver","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_label","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerLabel","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"changeBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myRootNode","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_ens","type":"address"},{"internalType":"address","name":"_resolver","type":"address"},{"internalType":"bytes32","name":"_node","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"label","type":"string"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"LabelRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"topic","type":"string"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"TopicRegistered","type":"event"}]';

const RSVABI = '[{"constant":true,"inputs":[{"internalType":"bytes4","name":"_id","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_erc20","type":"address"}],"name":"sweepToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"},{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"}],"name":"setPubkey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"theENS","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"addr","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sweepEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"}],"name":"pubkey","outputs":[{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"},{"internalType":"address","name":"_newAddr","type":"address"}],"name":"setAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"changeBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"keys","outputs":[{"internalType":"bytes32","name":"x","type":"bytes32"},{"internalType":"bytes32","name":"y","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_ens","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddrChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"x","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"y","type":"bytes32"}],"name":"PubkeyChanged","type":"event"}]';
