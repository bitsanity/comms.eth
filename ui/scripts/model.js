//var FROMBLOCK = 0; // TEST
var FROMBLOCK = 9000000; // PROD

var GASREGLAB = 100000; // gas to register a label
var GASSETKEY = 150000; // gas to setPubkey
var GASSETRSV = 100000; // gas to setResolver in ENS
var GASSETRVN = 150000; // gas to setName in ReverseRegistrar
var GASREGISTER = GASREGLAB + GASSETKEY;
var GASTOPIC = GASREGLAB;
var GASPOST = 250000;

var ENS, RVR, REG, RSV;

// TEST
//ENS='0x4ebf4321a360533ac2d48a713b8f18d341210078';
//RVR='0xf68580c3263fb98c6eaee7164afd45ecf6189ebb';
//REG='0x3b9b02d76cc7a327adf99255fe39558089614937';
//RSV='0x9e8bfcbc56a63ca595c262e1921d3b7a00bb9cf0';

// PROD
// old ENS="0x314159265dd8dbb310642f98f50c066173c1259b";
ENS="0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // Ethereum name service
RVR="0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069"; // reverse registrar
RRV='0x5fBb459C49BB06083C33109fA4f14810eC2Cf358'; // reverse resolver
REG='0xbC8a649C8B3b739b6ea22bb48E1B051b63157eda'; // blabb.eth registrar
RSV='0xC53eC25c7FaA673C63881036d5a29914449Ed4Af'; // blabb.eth resolver

var web3;

var ENSCon;
var RevRegCon;
var RevResolverCon;
var RegistarCon;
var ResolverCon;

// because web3.eth.getTransactionCount() bug still not fixed
// format { acct:nonce, acct2:nonce2, ... }
var RunningNonces = {};

function Ξconnect( wsurl, errcb, rescb ) {
  web3 = new Web3( new Web3.providers.WebsocketProvider(wsurl) );

  web3.eth.getGasPrice()
  .then( res => {

    ENSCon = new web3.eth.Contract( JSON.parse(ENSABI), ENS );
    RevRegCon = new web3.eth.Contract( JSON.parse(RVRABI), RVR );
    RevRegCon.methods.defaultResolver().call()
    .then( (rsv) => {

      RevResolverCon = new web3.eth.Contract( JSON.parse(RRVABI), rsv );
      RegistarCon = new web3.eth.Contract( JSON.parse(REGABI), REG );
      ResolverCon = new web3.eth.Contract( JSON.parse(RSVABI), RSV );
    } )
    .catch( (err) => {
      errcb( err.toString() );
      return;
    } );

    rescb();
  } )
  .catch( (err) => {
    errcb( err.toString() );
  } );
}

function ΞnextNonce( addr ) {
  let acct = addr.toLowerCase();

  if (RunningNonces.acct) {
    return RunningNonces.acct++;
  }

  web3.eth.getTransactionCount(acct)
  .then( cnt => {
    RunningNonces.acct = parseInt( cnt );
  } )
  .catch( err => {console.log(err.toString())} );

  return -1;
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

function Ξbalance( acct, errcb, rescb ) {
  web3.eth.getBalance( acct )
  .then( bal => { rescb(bal) } )
  .catch( err => { errcb(err.toString()) } );
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
    {fromBlock:FROMBLOCK, toBlock:'latest'} )
  .then( (evts) => {

    for (let ii = 0; ii < evts.length; ii++) {
      if ( nametocheck.toLowerCase()
           == evts[ii].returnValues.label.toLowerCase() ) {
        cb( true );
        return;
      }
    }

    RegistarCon.getPastEvents( 'TopicRegistered',
      {fromBlock:FROMBLOCK, toBlock:'latest'} )
    .then( (evts) => {

      for (ii = 0; ii < evts.length; ii++) {
        if ( nametocheck.toLowerCase()
             == evts[ii].returnValues.topic.toLowerCase() ) {
          cb( true );
          return;
        }
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
    { fromBlock: FROMBLOCK, filter: { owner: acct }, toBlock: 'latest' } )
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

  let thenonce = ΞnextNonce( acct );
  if (thenonce < 0) {
    errcb( 'no nonce: ' + acct );
    return;
  }

  let pubstring = getPublicKeyBuff( acct ).toString('hex');
  let x = web3.utils.hexToBytes( "0x" + pubstring.substring(0, 64) );
  let y = web3.utils.hexToBytes( "0x" + pubstring.substring(64) );

  let calldata = RegistarCon.methods.registerLabelAndKey(
    newname, x, y, acct ).encodeABI();

  let txobj = { nonce:thenonce,
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

    txobj = { nonce: ΞnextNonce(acct),
              to:RVR,
              gas:GASSETRVN,
              gasPrice:gasprice,
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

  let thenonce = ΞnextNonce( acct );
  if (thenonce < 0) {
    errcb( 'no nonce: ' + acct );
    return;
  }

  let calldata = RegistarCon.methods.registerTopic( newtop, acct ).encodeABI();

  let txobj = { nonce: thenonce,
                to: REG,
                value: val,
                gas: GASTOPIC,
                gasPrice: gasprice,
                data: calldata };

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

//
// TODO: registrar should do this automatically
//
async function ΞsetResolver( acct, fqname, gasprice, errcb, rescb ) {

  let node = ΞhexToBytes( namehash.hash(fqname) );
  let calldata = ENSCon.methods.setResolver( node, acct ).encodeABI();
  let txobj = { nonce: ΞnextNonce(acct),
                to:ENS,
                gas: GASSETRSV,
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

  let thenonce = ΞnextNonce( acct );
  if (thenonce < 0) {
    errcb( 'no nonce: ' + acct );
    return;
  }

  let txobj = { nonce:thenonce,
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
    {fromBlock: FROMBLOCK, toBlock: 'latest'} )
  .then( (evts) => {
    for( ii = 0; ii < evts.length; ii++ ) {
      result.push( evts[ii].returnValues.topic );
    }

    cb( result );
  } )
  .catch( (err) => { console.log( err.toString() ); } );
}

//
// TODO need a more efficient query
//
async function
ΞretrieveMessages( blockstogoback, toaddr, fromaddr, keywords, cb ) {
  let result = [];

  let useto = ΞisAddress( toaddr );
  let usefrom = ΞisAddress( fromaddr );
  let blocknum = await web3.eth.getBlockNumber();

  let fromblock = (blocknum > blockstogoback) ? (blocknum - blockstogoback) : 0;
  if (fromblock < 9204018) fromblock = 9204018; // Hello World

  for( let ii = fromblock; ii <= blocknum; ii++ ) {
    let blk = await web3.eth.getBlock( ii, true );

    for( let jj = 0; jj < blk.transactions.length; jj++ ) {

      // ignore simple transfers - no data
      if (    !blk.transactions[jj].input
           || blk.transactions[jj].input.length == 0 ) {
        continue;
      }

      // ignore blank 'to' fields (contract creates)
      if (    !blk.transactions[jj].to
           || blk.transactions[jj].to.length == 0
           || /0x0+$/.test(blk.transactions[jj].to)
           || blk.transactions[jj].to.toLowerCase() === "null" ) {
        continue;
      }

      if ( usefrom && fromaddr.toLowerCase() !==
           blk.transactions[jj].from.toLowerCase() ) {
        continue;
      }

      if (   useto
          && toaddr.toLowerCase() !== blk.transactions[jj].to.toLowerCase() ) {
        continue;
      }

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

  let acct = addr.toLowerCase();
  if (acct.startsWith('0x'))
    acct = acct.substring(2);

  // TEST values
  //if ( acct == '8c34F41f1cf2dfe2C28B1Ce7808031c40CE26d38'.toLowerCase() ) {
  //  cb( hash, 'admin.blabb.eth' );
  //  return;
  //}
  //else
  //  if ( acct == '147b61187F3F16583AC77060cbc4f711AE6c9349'.toLowerCase()) {
  //  cb( hash, 'bloggins.blabb.eth' );
  //  return;
  //}

  let fqname = acct + '.addr.reverse';
  let node = ΞhexToBytes( namehash.hash(fqname) );

  RevResolverCon.methods.name( node ).call()
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
