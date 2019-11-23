const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const MYGASPRICE = '' + 1 * 1e9; // ignored, test env

function getABI() {
  return JSON.parse( fs.readFileSync(
    './build/ReverseRegistrarMock_sol_ReverseRegistrarMock.abi').toString() );
}

function getBinary() {
  var binary = fs.readFileSync(
    './build/ReverseRegistrarMock_sol_ReverseRegistrarMock.bin').toString();

  if (!binary.startsWith('0x')) binary = '0x' + binary;
  return binary;
}

function getContract(sca) {
  return new web3.eth.Contract( getABI(), sca );
}

function printEvent(evt) {

  if (evt.event == 'Claimed' ) {
    console.log( 'Claimed:\n\towner: ' + evt.returnValues.owner +
                 '\n\tresolver: ' + evt.returnValues.resolver );
  }
  else if (evt.event == 'Named') {
    console.log( 'Named:\n\tnode: ' + evt.returnValues.node +
                 '\n\tname: ' + evt.returnValues.name );
  }
}

const cmds =
  [
   'deploy',
   'events',
   'claim',
   'claimWithResolver',
   'setName'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy |\n',
     '\tevents |\n',
     '\tclaim <owner> |\n',
     '\tclaimWithResolver <owner> <resolver> |\n',
     '\tsetName <node> <name> |\n'
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

    if (cmd == 'deploy') {
      let con = new web3.eth.Contract( getABI() );

      con
        .deploy({data:getBinary()} )
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
    else {
      let con = new web3.eth.Contract( getABI(), sca );

      if (cmd == 'events') {
        con.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
           .then( (events) => {
          for (var ii = 0; ii < events.length; ii++) {
            printEvent( events[ii] );
          }
        } )
        .catch( err => { console.log } );
      }

      if (cmd == 'claim')
      {
        let owner = process.argv[5];

        con.methods.claim( owner )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log } );
      }
      if (cmd == 'claimWithResolver')
      {
        let owner = process.argv[5];
        let resolver = process.argv[6];

        con.methods.claimWithResolver( owner, resolver )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log } );
      }

      if (cmd == 'setName') {

        let node = process.argv[5]; console.log( node );
        let name = process.argv[6]; console.log( name );

        con.methods.setName( web3.utils.hexToBytes(node), name )
        .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
        .catch( err => { console.log } );
      }

//    process.exit(0);
    }
} );

