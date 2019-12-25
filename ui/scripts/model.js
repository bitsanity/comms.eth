//
// REMEMBER: change is returned as long as the transaction does not revert
//
var GASREGLAB = 100000;
var GASSETNAM = 150000;
var GASREGISTER = GASREGLAB + GASSETNAM;
var GASTOPIC = 100000;
var GASPOST = 250000; // 21000 for a simple send, plus generous slack for data

var TESTMODE = true;
var WS_URL, ENS, RVR, REG, RSV;

if (TESTMODE) {
  WS_URL = "ws://localhost:8545"; // ganache
  ENS='0x4ebf4321a360533ac2d48a713b8f18d341210078'; // .eth registrar
  RVR='0xf68580c3263fb98c6eaee7164afd45ecf6189ebb'; // reverse registrar
  REG='0x3b9b02d76cc7a327adf99255fe39558089614937'; // our registrar
  RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0'; // our resolver
}
else { // PROD
  WS_URL = "ws://localhost:8546"; // geth
  ENS="0x314159265dd8dbb310642f98f50c066173c1259b"; // .eth registrar
  RVR="0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069"; // reverse registrar
  RRV='0x5fBb459C49BB06083C33109fA4f14810eC2Cf358'; // reverse resolver
  REG='0xbC8a649C8B3b739b6ea22bb48E1B051b63157eda'; // blabb.eth registrar
  RSV='0x465021F80c7cE7560D14c5BB3f96946Ec7D27870'; // blabb.eth resolver
}

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

function ΞweiToSzabo( wei ) {
  return web3.utils.fromWei( wei, 'szabo' );
}

function ΞweiToFinney( wei ) {
  return web3.utils.fromWei( wei, 'finney' );
}

function ΞnetworkGasPrice( cb ) {
  web3.eth.getGasPrice()
  .then( res => { cb( res / 1e09 ); } )
  .catch( (err) => { console.log( err ); } );
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

  try { sca.startsWith("0x"); }
  catch(err) {
    console.log( 'bad sca: ' + sca );
    new Error().stack;
  }

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

function ΞutfToHex( str ) {
  return web3.utils.utf8ToHex( str );
}

function ΞhexToUtf( hexstr ) {
  return web3.utils.hexToUtf8( hexstr );
}

async function Ξbalance( acct ) {
  return await web3.eth.getBalance( acct );
}

function ΞnamekeyFee( cb ) {
  RegistarCon.methods.namekeyfee().call().then( (nkf) => { cb( nkf ); } )
  .catch( err => { console.log(err.toString()) } );
}

function ΞtopicFee( cb ) {
  RegistarCon.methods.topicfee().call().then( (tf) => { cb( tf ); } )
  .catch( err => { console.log(err.toString()) } );
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

function ΞhasPubkey( acct, cb ) {
  ΞaddressToName( '0x0', acct, function(hash,name) {
    ΞgetPublicKey( hash, name, function(hash2,pubkey) {
      cb( true );
    } );
  } );
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

async function
ΞmakeName( acct, newname, val, gasprice, errcb, rescb ) {

  let pubstring = getPublicKeyBuff( acct ).toString('hex');
  let x = web3.utils.hexToBytes( "0x" + pubstring.substring(0, 64) );
  let y = web3.utils.hexToBytes( "0x" + pubstring.substring(64) );

  let calldata = RegistarCon.methods.registerLabelAndKey(
    newname, x, y, acct ).encodeABI();

  let txobj = { nonce: await web3.eth.getTransactionCount(acct),
                to:REG,
                value:val,
                gas:GASREGISTER,
                gasPrice:gasprice,
                data:calldata };

  let priv = getPrivateKeyBuff( acct ).toString('hex');
  let signedTx = await web3.eth.accounts.signTransaction( txobj, priv );

  web3.eth.sendSignedTransaction( signedTx.rawTransaction, async (err,res) => {
    if (err) {
      errcb(err);
      return;
    }

    calldata =
      RevRegCon.methods.setName( newname + STRINGS[LANG].DAppNamespace )
               .encodeABI();

    let newnonce = await web3.eth.getTransactionCount(acct);
    txobj = { nonce: newnonce, to:RVR, gas:GASSETNAM, gasPrice:gasprice,
              data:calldata };

    signedTx = await web3.eth.accounts.signTransaction( txobj, priv );

    web3.eth.sendSignedTransaction( signedTx.rawTransaction, (err,res) => {
      if (err) {
        errcb(err);
        return;
      }
      rescb( res );
    } );
  } );
}

async function ΞmakeTopic( acct, newtop, val, gasprice, errcb, rescb ) {

  let calldata = RegistarCon.methods.registerTopic( newtop, acct ).encodeABI();

  let txobj = { nonce: await web3.eth.getTransactionCount(acct),
                to:REG,
                value: val,
                gas: GASTOPIC,
                gasPrice: gasprice,
                data:calldata };

  let priv = getPrivateKeyBuff( acct ).toString('hex');
  let signedTxObj = await web3.eth.accounts.signTransaction( txobj, priv );
  web3.eth.sendSignedTransaction( signedTxObj.rawTransaction, (err,res) => {
    if (err) {
      errcb(err);
      return;
    }
    rescb( res );
  } );
}

async function
ΞpostMessage( toaddr, acct, val, messagehex, gasprix, errcb, rescb ) {

  if (    !ΞisAddress(toaddr)
       || !acct
       || !ΞisAddress(acct)
       || !messagehex
       || messagehex.length == 0) {
    console.log( 'invalid args' );
    return;
  }

  let txobj = { nonce: await web3.eth.getTransactionCount(acct),
                to:toaddr,
                value:val,
                data:messagehex,
                gas:GASPOST,
                gasPrice:gasprix };

  let priv = getPrivateKeyBuff( acct ).toString('hex');
  let signedTxObj = await web3.eth.accounts.signTransaction( txobj, priv );

  web3.eth.sendSignedTransaction( signedTxObj.rawTransaction, (err,res) => {
    if (err) {
      errcb(err);
      return;
    }
    rescb( res );
  } );
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
ΞretrieveMessages( blockstogoback, toaddr, fromaddr, keywords, cb ) {
  let result = [];

  let usefrom = ΞisAddress( fromaddr );
  let blocknum = await web3.eth.getBlockNumber();
  let fromblock = (blocknum > blockstogoback) ? (blocknum - blockstogoback) : 0;

  for( let ii = fromblock; ii <= blocknum; ii++ ) {
    let blk = await web3.eth.getBlock( ii, true );

    for( let jj = 0; jj < blk.transactions.length; jj++ ) {

      // ignore simple transfers - no data
      if (    !blk.transactions[jj].input
           || blk.transactions[jj].input.length == 0 )
        continue;

      // ignore contract creates
      if (!blk.transactions[jj].to)
        continue;

      if (   usefrom
          && fromaddr.toLowerCase() != blk.transactions[jj].from.toLowerCase())
        continue;

      if (   toaddr
          && toaddr.toLowerCase() != blk.transactions[jj].to.toLowerCase() )
        continue;

      // this will only work on unencrypted messages
      if (keywords && keywords.length > 0) {
        try {
          let data = web3.utils.hexToUtf8( blk.transactions[jj].input )

          if (keywords && keywords.length > 0) {
            let parts = keywords.split( /\s/ );
            let found = false;
            for (let kk = 0; kk < parts.length; kk++) {
              if ( data.includes(parts[kk]) )
                found = true;
            }
            if (!found) {
              continue;
            }
          }
        }
        catch(err) {
          console.log(err.message)
          continue;
        };
      }

      let tx = {  hash:blk.transactions[jj].hash,
                 block:blk.transactions[jj].blockNumber,
                  from:blk.transactions[jj].from,
                    to:blk.transactions[jj].to,
                 input:blk.transactions[jj].input };

      result.push( tx );

    } // end foreach tx in block
  } // end foreach block
  cb( result );
}

function ΞnameToAddress( name, cb ) {
  if ( !name || name.length == 0 || !name.endsWith('.eth') ) return;

  let node = ΞhexToBytes( namehash.hash(name) );
  ENSCon.methods.resolver( node ).call().then( (resvaddr) => {
    if (!ΞisAddress(resvaddr)) return;

    let resvcon = new web3.eth.Contract( JSON.parse(RSVABI), resvaddr );
    resvcon.methods.addr( node ).call().then( (result) => {
      if ( cb && ΞisAddress(result))
        cb( result );
    } )
    .catch( (err) => { console.log(err.toString()) } );
  } )
  .catch( (err) => { console.log(err.toString()) } );
}

function ΞaddressToName( hash, addr, cb ) {

  // TEST values
  if (    addr.toLowerCase()
       == '0x8c34F41f1cf2dfe2C28B1Ce7808031c40CE26d38'.toLowerCase() ) {
    cb( hash, 'admin.blabb.eth' );
    return;
  }
  else if (    addr.toLowerCase()
            == '0x147b61187F3F16583AC77060cbc4f711AE6c9349'.toLowerCase()) {
    cb( hash, 'bloggins.blabb.eth' );
    return;
  }

  RevResolverCon.methods.name( addr ).call()
  .then( (res) => {
    if (cb && res && res.length > 0) cb( hash, res );
  } )
  .catch( (err) => { console.log(err.toString()) } );
}

function ΞgetPublicKey( hash, fqname, cb ) {
  if ( !fqname || fqname.length == 0 || !fqname.endsWith('.eth') ) return;

  let node = ΞhexToBytes( namehash.hash(fqname) );
  ENSCon.methods.resolver( node ).call()
  .then( (resaddr) => {

    if (!resaddr || resaddr.length == 0 || !ΞisAddress(resaddr)) return;

    let rescon = new web3.eth.Contract( JSON.parse(RSVABI), resaddr );

    rescon.methods.pubkey( node ).call()
    .then( (pubkeyxy) => {
      cb( hash, [pubkeyxy._x, pubkeyxy._y] );
    } )
    .catch( (err) => { new Error().stack } );
  } )
  .catch( (err) => { console.log(err.toString()) } );
}

//
// DATA SECTION
//

const ENSABI = '[{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]';

const RVRABI = '[{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_resolver","type":"address"}],"name":"claimWithResolver","outputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"claim","outputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"defaultResolver","outputs":[{"internalType":"contract ReverseResolver","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"setName","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"resolver","type":"address"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"Named","type":"event"}]';

const RRVABI = '[{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"}],"payable":false,"type":"constructor"}]';

const REGABI =
'[{"constant":false,"inputs":[{"internalType":"address","name":"_erc20","type":"address"}],"name":"sweepToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_newfee","type":"uint256"}],"name":"setNameKeyFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"changeDomainOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_label","type":"string"},{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerLabelAndKey","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"theENS","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_topic","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerTopic","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newresolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"namekeyfee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"namefee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"defaultResolver","outputs":[{"internalType":"contract Resolver","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sweepEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_newfee","type":"uint256"}],"name":"setNameFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_newfee","type":"uint256"}],"name":"setTopicFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"topicfee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_label","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"name":"registerLabel","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"changeBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myRootNode","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_ens","type":"address"},{"internalType":"address","name":"_resolver","type":"address"},{"internalType":"bytes32","name":"_node","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"label","type":"string"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"LabelRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"topic","type":"string"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"TopicRegistered","type":"event"}]';

const RSVABI = '[{"constant":true,"inputs":[{"internalType":"bytes4","name":"_id","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_erc20","type":"address"}],"name":"sweepToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"},{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"}],"name":"setPubkey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"theENS","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"addr","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sweepEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"}],"name":"pubkey","outputs":[{"internalType":"bytes32","name":"_x","type":"bytes32"},{"internalType":"bytes32","name":"_y","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_node","type":"bytes32"},{"internalType":"address","name":"_newAddr","type":"address"}],"name":"setAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"changeBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"keys","outputs":[{"internalType":"bytes32","name":"x","type":"bytes32"},{"internalType":"bytes32","name":"y","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_ens","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddrChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"x","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"y","type":"bytes32"}],"name":"PubkeyChanged","type":"event"}]';
