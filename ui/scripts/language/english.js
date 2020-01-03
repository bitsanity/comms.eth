STRINGS["English"] = {

  // top section
  SkinLabel:"Theme:",
  LanguageLabel:"Language:",
  SettingsTabLabel:"Settings",
  ViewTabLabel:"Read",
  PostTabLabel:"Post",
  AboutTabLabel:"About",
  LoadKeyTabLabel:"Login",

  // tab 1 - settings
  WSURLLabel:"web3 Gateway:",
  UseAddressLabel:"Address:",
  UnlockButtonCommand:"Unlock ...",
  PassphrasePrompt:"Passphrase to unlock:",
  UseHandleLabel:"My Names:",
  DAppNamespace:".blabb.eth",
  GasPriceLabel:"Gas Price:",
  GasPriceUnits:"Gwei",
  EthGasStationLink:"ETH Gas Station",
  LastBlocksLabel:"Search Blocks:",
  GetNameLegend:"Register Name and Public Key",
  NameToGetLB:"Name:",
  ForAddressLB:"Owner:",
  ValueLB:"Value (min):",
  GasEstLB:"Gas Units:",
  GasEstVal:"< 250000",
  GetHandleButtonCommand:"Get Name ...",
  GetNewNamePrompt:"New label to create:",
  NameAlreadyTaken:"Name already exists.",
  TopicAlreadyTaken:"Topic already exists.",
  GetTopicLegend:"Make a Topic",
  TopicToGetLB:"Topic:",
  TopicGasEstVal:"< 100000",

  // tab 2 - view
  ViewLegend:"Search Criteria",
  SentToLabel:"Sent To:",
  NameAddressLabel:"(Name | Address)",
  TopicSelectLabel:"or Topic:",
  FromLabel:"From:",
  KeywordsLabel:"with Keywords:",
  SearchButtonCommand:"Search",
  MessagesLabel:"Messages:",
  ContentsLabel:"Contents:",
  BlackHexButton:": On-Chain",
  BlackUtfButton:": Raw Text",
  RedUtfButton:": Decrypted",
  ViewNoPrivateKeyAlert:"No private key loaded for account.",
  ViewSenderNameAlert:"Sender's name required.",
  ViewSenderPubkeyAlert:"Sender's public key required.",
  ViewPrivateKeyPassphrasePrompt:"Private key passphrase to decrypt:",

  // tab 3 - post
  PostToTopicLabel:"Post to Topic:",
  NewTopicCommand:"New Topic...",
  PostToAddressLabel:"or to:",
  PostValueLB:"Value (min):",
  PostGasEstLB:"Gas Units:",
  MessageToPostLabel:"Message to Post:",
  EncryptedLabel:"Encrypt:",
  NoLabel:"No",
  YesLabel:"Yes",
  PostButtonCommand:"Post",
  SendUnencrypted:"Send unencrypted?",
  PostInvalidAlert:"'To' invalid address or unresolved name.",
  PostNoMessageAlert:"No message.",
  PostNoEncryptForTopicAlert:"Cannot encrypt messages sent to topic.",
  PostNoSenderAlert:"Sending address not set.",
  PostToAddrInvalidAlert:"To address invalid.",
  PostSenderHasNoPubkeyAlert:"WARN: Sending without a registered pubkey.",

  // Load Key
  LoadKeyLabel:"Paste geth Account File Contents (JSON):",
  LoadRawKeyLabel:"Paste Raw Private Key (hex)",
  LoadGethKeyButton:"Load",

  // tab 4 - About
  AboutHTML:`blabb.eth version 0.1 (alpha)


"A wyse tonge commendeth knowlege, a foolish mouth blabbeth out nothinge but foolishnesse."
--Proverbs 15:2, Miles Coverdale Bible (1535)


blabb.eth transmits plaintext or encrypted messaging in Ethereum transactions. Point-to-point and
broadcast (to topic) features are supported.


*** Security Warnings ***

1. This sofware includes the source code and is written as simply as possible for inspection.
   Anyone who can modify the code can also introduce security faults. Each user is responsible
   to inspect and control access to his/her copy of the software.

2. All software, including this software, has the potential to include defects (bugs).

3. Quote: The ECIES implementation given here is solely based off Parity's implementation. This
   module offers no guarantees as to the security or validity of the implementation. Furthermore,
   this project is being actively developed and as such should not be used for highly sensitive
   information. Endquote --https://github.com/sigp/ecies-parity

4. Encrypted messages require the receiver's private key in order to decrypt them.  Loss of one's
   private key means loss of one's ability to read one's inbound encrypted messages.


*** Privacy Warnings ***

1. Anyone can use blabb.eth to post public, plain text messages on the blockchain. These messages
   will be readable forever by anyone.

2. Information about what addresses have exchanged messages and the timing of them can provide
   valuable information to observers.

3. Sending an ECIES encrypted message requires the receiver's public key be already published in
   the Ethereum Name Service (ENS).


*** Dependency Warnings ***

1. blabb.eth is dependent on the availability of and access to the Ethereum public blockchain.

2. blabb.eth and all .eth names depend on a set of smart contracts together implementing a
   service known as Ethereum Name Service (ENS).

3. This software was developed to run in a browser environment - specifically the nw.js
   platform. Other platforms (e.g. Chrome with MetaMask ) may or may not work correctly.


--- Notes ---

1. Developed in/for https://nwjs.io/ environment. Assumes a web3 websocket provider is
   available. The websocket URL is a setting.

2. The software is constructed to use only the read-only services of a web3 gateway plus
   forwarding raw already-signed transactions. The software does not use unsafe unlock. The
   software does not read local accounts nor does it depend on geth to sign transactions.

3. The message search capability will be much more responsive if the web3 gateway is a full
   node.

4. The blabb.eth client performs ECIES encryption and requires the user's private key to decrypt
   inbound messages.

5. The blabb.eth client will prompt the user for the passphrase to an Ethereum address if
   required to retrieve the key from an encrypted keyfile object.

6. Private keys and passphrases are held only in memory only. The software will not and should
   never write this information to disk nor transmit it outside of the process.


--- Fee Disclosure ---

1. The Ethereum blockchain requires "gas" whenever a transaction changes the blockchain state.
   Reading the blockchain is free of charge, provided one has web3 access. This gas is not paid
   to blabb.eth but rather goes to a miner.

2. Anyone may use the blabb.eth software free of charge for any purpose.

3. Anyone may register an ENS name under blabb.eth, or any other ENS domain for a fee paid to
   the blabb.eth Registrar smart contract.

4. The Registrar requires an amount of value in addition to gas. The required amount is settable
   by the admin and is always readable from the Registrar smart contract.


--- Licenses ---

blabb.eth

MIT License

Copyright (c) 2019 blabb.eth original author, community and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


web3.min.js

web3.js is free software: you can redistribute it and/or modify it under the terms of the
GNU Lesser General Public License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

web3.js is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with web3.js.
If not, see <http://www.gnu.org/licenses/>.


eth-ens-namehash

The blabb.eth client includes https://github.com/danfinlay/eth-ens-namehash published with
no stated license (as of 12/2019)


keythereum

Copyright (c) 2015: Jack Peterson.

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


cryptocoinjs/secp256k1-node

The MIT License (MIT)

Copyright (c) 2014-2016 secp256k1-node contributors

Parts of this software are based on bn.js, elliptic, hash.js Copyright (c) 2014-2016
Fedor Indutny

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


ecies-parity

MIT License

Copyright (c) 2018 Age Manning

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  ` };
