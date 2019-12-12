const ecies = require( "ecies-parity" );
const keccak = require( "keccak256" );

// our test keys from ganache-cli
let PVTA='0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a';
let PUBA='041eb4c8b9283f1ed94b710435d943f64bb7fdbb2feeecdcff85c63da92e16975c2bacdbbf6bfefb1a2f9195e79466970496b8f2c218b3abb7379d8688ac4b3d7f';
let ACCTA='0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38';

let PVTB='0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7';
let PUBB='04b2d696107d702c745f3df7c2455ad03c5b39067bdc8ad9a3e85a5a927189fed627393f76cbacbbd7d9b70bc9b589cb19b53a38dc16e7541f74bcc54400563c7c';
let ACCTB='0x147b61187f3f16583ac77060cbc4f711ae6c9349';

let privA = Buffer.from( PVTA.substring(2), 'hex' );
let privB = Buffer.from( PVTB.substring(2), 'hex' );
let pubA = ecies.getPublic( privA );
let pubB = Buffer.from( PUBB, 'hex' );

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

