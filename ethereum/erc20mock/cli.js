const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const MYGASPRICE = '' + 1 * 1e9; // ignored, test env

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/ERC20Mock_sol_ERC20Mock.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/ERC20Mock_sol_ERC20Mock.bin').toString();

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

function printEvent(evt) {
  //event Transfer(address indexed _from, address indexed _to, uint _value);
  if (evt.event == 'Transfer' ) {
    console.log( 'Transfer:\n\t_from: ' + evt.returnValues._from +
                 '\n\t_to: ' + evt.returnValues._to +
                 '\n\t_value: ' + evt.returnValues._value );
  }
}


const cmds =
  [
   'deploy',
   'events',
   'balanceOf',
   'transfer'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy |\n',
     '\tevents |\n',
     '\tbalanceOf <address> |\n',
     '\ttransfer <address> <uint>\n'
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
checkAddr( sca );

var eb;
web3.eth.getAccounts().then( (res) => {
    eb = res[ebi];

    if (cmd == 'deploy') {
      let con = new web3.eth.Contract( getABI() );
      let rvr = process.argv[5];

      con
        .deploy( {data:getBinary()} )
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

      if (cmd == 'balanceOf')
      {
        let addr = process.argv[5];

        con.methods.balanceOf( addr )
        .call()
        .then( (res) => {
          console.log( res )
        } )
        .catch( err => { console.log } );
      }

      if (cmd == 'transfer') {

        let addr = process.argv[5];
        let amt = process.argv[6];

        con.methods.transfer( addr, amt )
           .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
           .catch( err => { console.log } );
      }

//    process.exit(0);
    }
} );

