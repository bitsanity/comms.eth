# comms.eth

Encrypted and plain-text messages in simple Ethereum transfers. Point-to-point
and broadcast-to-topic modes.

> Cryptography Warning
>
> The ECIES implementation given here is solely based off Parity's implementation. This module offers no guarantees as to the security or validity of the implementation. Furthermore, this project is being actively developed and as such should not be used for highly sensitive information. --https://github.com/sigp/ecies-parity

# Deployment

The public ENS : 0x314159265dd8dbb310642f98f50c066173c1259b

# Dependencies

* [ENS](https://ens.domains) smart contracts including

* [Ethereum](https://ethereum.org) public blockchain

* developed with/for [NW](https://nwjs.io/) environment with a web3 provider
  (e.g. geth) present.
  
* The dapp requires access to the user's private key in order to register a
  public key and to enable the user to decrypt messages.

* includes an unmodified copy of `web3.min.js` from
  [ethereum/web3.js](https://github.com/ethereum/web3.js/) under
  [LICENSE](https://github.com/ethereum/web3.js/blob/1.x/LICENSE):

* includes [browserify](https://github.com/browserify/browserify)'d copy of
  [danfinlay/eth-ens-namehash](https://github.com/danfinlay/eth-ens-namehash)
  as published via [NPM](https://www.npmjs.com/package/eth-ens-namehash) which
  further includes
  [idna-uts46-hx](https://www.npmjs.com/package/idna-uts46-hx) and
  and [js-sha](https://www.npmjs.com/package/js-sha3).

* includes `keythereum.min.js` from the
  [ethereumjs/keythereum](https://github.com/ethereumjs/keythereum) project
  under
  [MIT LICENSE](https://github.com/ethereumjs/keythereum/blob/master/LICENSE)

* includes `elliptic.min.js` from the
  [indutny/elliptic](https://github.com/indutny/elliptic) project under
  [MIT LICENSE](https://github.com/indutny/elliptic#license)

* includes browserified 'ecies-parity' from the
  [sigp/ecies-parity](https://github.com/sigp/ecies-parity) project under 
  [MIT LICENSE](https://github.com/sigp/ecies-parity/blob/master/LICENSE)

