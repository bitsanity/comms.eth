const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const MYGASPRICE = '' + 1 * 1e9;

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/Registrar_sol_Registrar.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/Registrar_sol_Registrar.bin').toString();
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

  if (evt.event == 'LabelRegistered' ) {
    console.log( 'LabelRegistered: ' + JSON.stringify(evt.returnValues) );
  }
  else if (evt.event == 'TopicRegistered' ) {
    console.log( "TopicRegistered:\n\ttopic: " + evt.returnValues.topic +
                 '\n\towner: ' + evt.returnValues.owner );
  }
}

const cmds =
  [
   'deploy',
   'events',
   'variables',
   'registerLabel',
   'registerLabelAndKey',
   'registerTopic',
   'sweepEther',
   'sweepToken',
   'changeBeneficiary',
   'setResolver'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy <ens address> <resolver address> <node> |\n',
     '\tevents |\n',
     '\tvariables |\n',
     '\tregisterLabel <string> <address> <value> |\n',
     '\tregisterLabelAndKey <string> <x> <y> <owner> <value> |\n',
     '\tregisterTopic <string> <address> <value> |\n',
     '\tsweepEther |\n',
     '\tsweepToken |\n',
     '\tchangeBeneficiary <address> |\n',
     '\tsetResolver <address> |\n'
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
      let ens = process.argv[5];
      let res = process.argv[6];
      let node = process.argv[7];

      console.log( 'ens: ' + ens );
      console.log( 'res: ' + res );
      console.log( 'node: ' + node );
      con
        .deploy({data:getBinary(),
                 arguments: [ens, res, web3.utils.hexToBytes(node)]} )
        .send({from: eb, gas: 1452525, gasPrice: MYGASPRICE}, (err, txhash) => {
          if (err) console.log( err );
        } )
        .on('error', (err) => { console.log("err: ", err); })
        .on('transactionHash', (h) => { console.log( "hash: ", h ); } )
        .on('receipt', (r) => { console.log( 'rcpt: ' + r.contractAddress); } )
        .on('confirmation', (cn, rcpt) => { console.log( 'cn: ', cn ); } )
        .then( (nin) => {
          console.log( "SCA", nin.options.address );
          process.exit(0);
        } );
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

        con.methods.defaultResolver().call().then( (res) => {
          console.log( "defaultResolver = ", res )
        } )
        .catch( err => { console.log(err.toString()) } );

        con.methods.myRootNode().call().then( (res) => {
          console.log( "myRootNode = ", res )
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

      if (cmd == 'registerLabel')
      {
        let label = process.argv[5];
        let owner = process.argv[6];
        let amt = process.argv[7];

        con.methods.registerLabel( label, owner )
        .send( {from: eb, value: amt, gas: 500000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'registerLabelAndKey')
      {
        let label = process.argv[5];
        let x = process.argv[6];
        let y = process.argv[7];
        let owner = process.argv[8];
        let amt = process.argv[9];

        con.methods.registerLabelAndKey(
            label,
            web3.utils.hexToBytes(x),
            web3.utils.hexToBytes(y),
            owner )
        .send( {from: eb, value: amt, gas: 500000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }
      if (cmd == 'registerTopic')
      {
        let topic = process.argv[5];
        let owner = process.argv[6];
        let amt = process.argv[7];

        con.methods.registerTopic( topic, owner )
        .send( {from: eb, value: amt, gas: 500000, gasPrice: MYGASPRICE} )
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
      if (cmd == 'setResolver')
      {
        let addr = process.argv[5];
        con.methods.setResolver( addr )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log(err.toString()) } );
      }

//    process.exit(0);
    }
} );

