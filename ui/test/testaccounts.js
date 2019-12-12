const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8546"));

let obj = web3.eth.accounts.encrypt(
  '0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a',
  'mypassword' );

console.log( JSON.stringify(obj) );

let ojb = web3.eth.accounts.encrypt(
  '0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7',
  'mypassword' );

console.log( JSON.stringify(ojb) );

// outputs:

let answer1 = '{"version":3,"id":"2c9d7ce3-3c52-4245-b856-101b753025c5","address":"8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38","crypto":{"ciphertext":"6a9216e9e7c9cf6f6be6996adbd0b0367300414f88db9e8108c5ae18cc1d4fe2","cipherparams":{"iv":"0a9b595d308e353bf92fc0d76583f84e"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"d460b88603d1112aac2d88eabc15cfda795bf157723973b8e8b19e9f599617d0","n":8192,"r":8,"p":1},"mac":"215a166cb5f07106177b2574c0f3661f7b90df3c654f43d21b077fa22b6ad883"}}';

let answer2 = '{"version":3,"id":"21b23f31-fcf9-4d63-9d2b-2b44f5d3d749","address":"147b61187f3f16583ac77060cbc4f711ae6c9349","crypto":{"ciphertext":"ce3fd3ecc1044336167593edc6577fc25df488574e91381987edad0a1eef9417","cipherparams":{"iv":"425f85e4e9c0b47fd17d273579d1ee6b"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"ef9b9955026ed82f6402a1df8d87750ee7ebcccb39b1a467eff18a01b0ab0c13","n":8192,"r":8,"p":1},"mac":"7e704cb2af22b7d0aa263702e799071033e9f7972b06ac9ab714612889a1f014"}}';

