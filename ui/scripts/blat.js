const ecies = require( "ecies-parity" );
const keccak = require( "keccak256" );

// our test keys from ganache-cli
let ACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38';
let ACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349';
let PVTA=
  '0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a';
let PVTB=
  '0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7';

let privA = Buffer.from( PVTA.substring(2), 'hex' );
let privB = Buffer.from( PVTB.substring(2), 'hex' );
let pubA = ecies.getPublic( privA );
let pubB = ecies.getPublic( privB );

console.log( 'pubA: ' + Buffer.from(pubA).toString('hex') );
console.log( 'pubB: ' + Buffer.from(pubB).toString('hex') );

let A = []; for( let ii = 1; ii < pubA.length; ii++ ) A.push( pubA[ii] );
let B = []; for( let jj = 1; jj < pubB.length; jj++ ) B.push( pubB[jj] );

// derive Ethereum addresses from pubkeys
console.log( 'A: 0x' + Buffer.from(keccak(A)).toString('hex').substring(24) );
console.log( 'B: 0x' + Buffer.from(keccak(B)).toString('hex').substring(24) );

let msg = "Hello World.";

// A -> B
ecies.encrypt( pubB, Buffer.from(msg) ).then( (encrypted) => {

  // B decrypts the message.
  ecies.decrypt( privB, encrypted ).then( (plaintext) => {
    console.log("B received:", plaintext.toString());
  });

});

