const fs = require('fs');
const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
//new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8546"));

const MYGASPRICE = '' + 1 * 1e9;

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/Resolver_sol_Resolver.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/Resolver_sol_Resolver.bin').toString();

  if (!binary.startsWith('0x')) binary = '0x' + binary;
  return binary;
}

function getContract(sca) {
  return new web3.eth.Contract( getABI(), sca );
}

function checkAddr(addr) {
  try {
    let isaddr = parseInt( addr );
  } catch( e ) {
    usage();
    process.exit(1);
  }
}

function shorten(addr) {
  var saddr = "" + addr;
  return "0x" + saddr.substring(26);
}

function printEvent(evt) {

  if (evt.event == 'AddrChanged' ) {
    console.log( 'AddrChanged: ' + JSON.stringify(evt.returnValues) );
  }
  else if (evt.event == 'PubkeyChanged' ) {
    console.log( "PubkeyChanged:\n\tnode: " + evt.returnValues.node +
                 '\n\tx: ' + evt.returnValues.x +
                 '\n\ty: ' + evt.returnValues.y );
  }
}

const cmds =
  [
   'deploy',
   'events',
   'variables',
   'addr',
   'pubkey',
   'setAddr',
   'setPubkey',
   'supportsInterface',
   'sweepEther',
   'sweepToken',
   'changeBeneficiary'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy <address> |\n',
     '\tevents |\n',
     '\tvariables |\n',
     '\taddr <node> |\n',
     '\tpubkey <node> |\n',
     '\tsetAddr <node> <address> |\n',
     '\tsetPubkey <node> <x> <y> | \n',
     '\tsupportsInterface <bytes4> |\n',
     '\tsweepEther |\n',
     '\tsweepToken |\n',
     '\tchangeBeneficiary <address> |\n'
  );
}

var cmd = process.argv[4];

let found = false;
for (let ii = 0; ii < cmds.length; ii++)
  if (cmds[ii] == cmd) found = true;

if (!found) {
  usage();
  process.exit(1);
}

var ebi = process.argv[2]; // etherbaseindex, i.e. use eth.accounts[ebi]
var sca = process.argv[3];

var eb;
web3.eth.getAccounts().then( (res) => {
    eb = res[ebi];
    if (cmd == 'deploy')
    {
      let con = new web3.eth.Contract( getABI() );
      let stubaddr = process.argv[5];
      checkAddr( stubaddr );

      con
        .deploy({data:getBinary(), arguments: [stubaddr]} )
        .send({from: eb, gas: 1452525, gasPrice: MYGASPRICE}, (err, txhash) => {
          if (err) console.log( err.toString() );
        } )
        .on('error', (err) => { console.log("err: ", err); })
        .on('transactionHash', (h) => { console.log( "hash: ", h ); } )
        .on('receipt', (r) => { console.log( 'rcpt: ' + r.contractAddress); } )
        .on('confirmation', (cn, rcpt) => { console.log( 'cn: ', cn ); } )
        .then( (nin) => {
          console.log( "SCA", nin.options.address );
          process.exit(0);
        } )
        .catch( err => { console.log(err.toString()) } );
    }
    else
    {
      let con = new web3.eth.Contract( getABI(), sca );

      if (cmd == 'events')
      {
        con.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
           .then( (events) =>
        {
          for (var ii = 0; ii < events.length; ii++) {
            printEvent( events[ii] );
          }
        })
        .catch( err => { console.log(err.toString()) } );
      }

      if (cmd == 'variables')
      {
        con.methods.theENS().call().then( (res) => {
          console.log( "theENS = ", res )
        } )
        .catch( err => { console.log(err.toString()) } );

        con.methods.beneficiary().call().then( (res) => {
          console.log( "beneficiary = ", res )
        } )
        .catch( err => { console.log(err.toString()) } );

        web3.eth.getBalance( sca ).then( (bal) => {
          console.log( "balance (wei): " + bal )
        } )
        .catch( err => { console.log(err.toString()) } );
      }

      if (cmd == 'addr')
      {
        let node = process.argv[5];
        con.methods.addr( web3.utils.hexToBytes(node) )
        .call().then( (res) => {
          console.log( res );
        } )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'setAddr')
      {
        let node = process.argv[5];
        let addr = process.argv[6];
        con.methods.setAddr( web3.utils.hexToBytes(node), addr )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'pubkey')
      {
        let node = process.argv[5];
        con.methods.pubkey( web3.utils.hexToBytes(node) )
        .call().then( (res) => {
          console.log( res );
        } )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'setPubkey')
      {
        let node = process.argv[5];
        let x = process.argv[6];
        let y = process.argv[7];
        con.methods.setPubkey( web3.utils.hexToBytes(node),
                               web3.utils.hexToBytes(x),
                               web3.utils.hexToBytes(y) )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'supportsInterface')
      {
        let node = process.argv[5];
        con.methods.supportsInterface( web3.utils.hexToBytes(node) )
        .call().then( (res) => {
          console.log( "supportsInterface: " + node + " = " + res );
        } )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'sweepEther')
      {
        con.methods.sweepEther()
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'sweepToken')
      {
        let tok = process.argv[5];
        con.methods.sweepToken( tok )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'changeBeneficiary')
      {
        let addr = process.argv[5];
        con.methods.changeBeneficiary( addr )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }

//    process.exit(0);
    }
} );

