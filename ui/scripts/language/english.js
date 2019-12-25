STRINGS["English"] = {

  // top section
  SkinLabel:"Theme:",
  LanguageLabel:"Language:",
  SettingsTabLabel:"Settings",
  ViewTabLabel:"Read",
  PostTabLabel:"Post",
  AboutTabLabel:"About",
  LoadKeyTabLabel:"Load Key",

  // tab 1 - settings
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
  LoadKeyLabel:"Paste geth account file contents:",
  LoadRawKeyLabel:"Paste hex privkey (format 0x...):",
  LoadGethKeyButton:"Load",

  // tab 4 - About
  AboutHTML:`blabb.eth version 0.1 (alpha)


"A wyse tonge commendeth knowlege, a foolish mouth blabbeth out nothinge but foolishnesse."
--Proverbs 15:2, Miles Coverdale Bible (1535)


blabb.eth transmits plaintext or encrypted messaging in Ethereum transactions. Point-to-point and
broadcast (to topic) features are supported.


*** Security Warning ***

This sofware includes the source code and is written as simply as possible for inspection. This
also makes it possible for a miscreant to modify the software and trick someone to run it and
reveal private information.

The user is responsible to inspect the downloaded software and confirm the absence of disk writes
and internet message exchanges other than with Ethereum.

Also remember that all software has the potential to include defects (bugs).

*** Dependency Warning ***

blabb.eth is dependent on the availability of the Ethereum public blockchain.

blabb.eth and all .eth names depend on a set of smart contracts that together implement a service
known as the Ethereum Name Service (ENS).

This software was developed to run in a browser environment - specifically the nw.js platform.
Other platforms may or may not work correctly.

*** Privacy Warning ***

Anyone can use blabb.eth to post public, plain text messages on the blockchain. These messages
will be readable by anyone in the world, forever.

Information about what addresses have exchanged messages and the timing of them can provide
valuable information to observers.

*** Encryption Warning ***

Encrypted messages require the receiver's private key in order to decrypt them.  Loss of one's
private key means loss of one's ability to read messages, forever.

*** Cryptography Warning ***

The ECIES implementation given here is solely based off Parity's implementation. This module
offers no guarantees as to the security or validity of the implementation. Furthermore,
this project is being actively developed and as such should not be used for highly sensitive
information.
--https://github.com/sigp/ecies-parity

*** Fee Disclosure ***

1. The Ethereum blockchain requires "gas" whenever a transaction changes the blockchain state.
   Reading the blockchain is free of charge, provided one has web3 access. This gas is not paid
   to blabb.eth but rather goes to a miner.

2. Anyone may use the blabb.eth software free of charge for any purpose.

3. Anyone may register an ENS name under blabb.eth, or any other ENS domain for a fee paid to the
   blabb.eth Registrar smart contract.

4. The Registrar requires an amount of value in addition to gas. The required amount is settable
   by the admin and is always readable from the Registrar smart contract.


----- Notes -----

Developed in/for https://nwjs.io/ environment. Assumes a web3 provider such as geth or parity
is available.

The software is constructed such that the personal module is not required. The software does not
read local accounts nor does it depend on geth to sign transactions.

The blabb.eth client may prompt the user for the passphrase to an Ethereum address if
required to unlock the account and post transactions.

The blabb.eth client performs ECIES encryption and requires the user's private key. An import from
outside format may require a passphrase to decrypt a given key object.

Private keys and passphrases are held only in memory only, always. The software will not and
should never write this information to disk nor transmit it outside of the process.

----- Licenses -----

web3.min.js

This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify it under the terms of the GNU
Lesser General Public License as published by the Free Software Foundation, either version
3 of the License, or (at your option) any later version.

web3.js is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with web3.js.
If not, see <http://www.gnu.org/licenses/>.


eth-ens-namehash

The blabb.eth client includes https://github.com/danfinlay/eth-ens-namehash published with no
stated license (as of 12/2019)


keythereum

Copyright (c) 2015: Jack Peterson.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


cryptocoinjs/secp256k1-node

The MIT License (MIT)

Copyright (c) 2014-2016 secp256k1-node contributors

Parts of this software are based on bn.js, elliptic, hash.js
Copyright (c) 2014-2016 Fedor Indutny

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


----------- ecies-party -----------

MIT License

Copyright (c) 2018 Age Manning

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


--------- blabb.eth ---------

MIT License

Copyright (c) 2019 blabb.eth community and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  ` };

