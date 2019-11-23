const fs = require('fs');
const namehash = require('eth-ens-namehash');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const MYGASPRICE = '' + 1 * 1e9; // ignored, test env

function getABI() {
  return JSON.parse(
    fs.readFileSync('./build/ENSMock_sol_ENSMock.abi').toString() );
}

function getBinary() {
  var binary =
    fs.readFileSync('./build/ENSMock_sol_ENSMock.bin').toString();

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

  //event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);
  if (evt.event == 'NewOwner' ) {
    console.log( 'NewOwner:\n\tnode: ' + evt.returnValues.node +
                 '\n\tlabel: ' + evt.returnValues.label +
                 '\n\towner: ' + evt.returnValues.owner );
  }
  //event Subnode(bytes32 indexed node);
  else if (evt.event == 'Subnode') {
    console.log( 'Subnode: ' + evt.returnValues.subnode );
  }
}

const cmds =
  [
   'deploy',
   'events',
   'keccak',
   'owner',
   'setSubnodeOwner',
   'namehash'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy |\n',
     '\tevents |\n',
     '\tkeccak <label> |\n',
     '\towner <node> |\n',
     '\tsetSubnodeOwner <node> <label> <owneraddress> |\n',
     '\tnamehash <name>\n'
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

    if (cmd == 'namehash') {
      let hashres = namehash.hash( process.argv[5] );
      console.log( hashres );
    }
    else if (cmd == 'keccak') {
      let hash = web3.utils.keccak256( process.argv[5] );
      console.log( hash );
    }
    else if (cmd == 'deploy') {
      let con = new web3.eth.Contract( getABI() );
      let rvr = process.argv[5];

      con
        .deploy({data:getBinary(), arguments: [rvr]} )
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

      if (cmd == 'owner')
      {
        let label = process.argv[5];

        con.methods.owner( web3.utils.hexToBytes(label) )
        .call()
        .then( (res) => {
          console.log( "owner = ", res )
        } )
        .catch( err => { console.log } );
      }

      if (cmd == 'setSubnodeOwner') {

        let  node = process.argv[5]; console.log( node );
        let label = process.argv[6]; console.log( label );
        let ownee = process.argv[7]; checkAddr( ownee );

        con.methods.setSubnodeOwner( web3.utils.hexToBytes(node),
                                     web3.utils.hexToBytes(label),
                                     ownee )
           .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
           .catch( err => { console.log } );
      }

//    process.exit(0);
    }
} );

