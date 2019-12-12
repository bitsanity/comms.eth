var STRINGS = {};
var LANG = "";

STRINGS["English"] = {

  // top section
  SkinLabel:"Skin:",
  LanguageLabel:"Language:",
  SettingsTabLabel:"Settings",
  ViewTabLabel:"View",
  PostTabLabel:"Post",
  AboutTabLabel:"About",

  // tab 1 - settings
  UseAddressLabel:"Use Address:",
  UnlockButtonCommand:"Unlock ...",
  PassphrasePrompt:"Passphrase to unlock:",
  UseHandleLabel:"My Names:",
  DAppNamespace:".blabb.eth",
  GasPriceLabel:"My Gas Price:",
  GasPriceUnits:"Gwei",
  LastBlocksLabel:"Search Blocks:",
  GetNameLegend:"Register a Name",
  NameToGetLB:"Name:",
  ForAddressLB:"Owner:",
  ValueLB:"Value (&gt; 0):",
  GasEstLB:"Gas Est.:",
  GasEstVal:"~120000 send 150000, change returned",
  GetHandleButtonCommand:"Get Name ...",
  GetNewNamePrompt:"New label to create:",
  NameAlreadyTaken:"Name already exists.",
  TopicAlreadyTaken:"Topic already exists.",
  GetTopicLegend:"Make a Topic",
  TopicToGetLB:"Topic:",
  TopicGasEstVal:"~100000 send 150000, change returned",

  // tab 2 - view
  SentToLabel:"Sent To:",
  NameAddressLabel:"(Name | Address)",
  TopicSelectLabel:"or Topic:",
  FromLabel:"From:",
  KeywordsLabel:"with Keywords:",
  SearchButtonCommand:"Search",
  MessagesLabel:"Messages:",
  ContentsLabel:"Contents:",
  BlackHexButton:"Raw Hex",
  BlackUtfButton:"Raw Utf",
  RedHexButton:"Decrypted Hex",
  RedUtfButton:"Decrypted Utf",

  // tab 3 - post
  PostToTopicLabel:"Post to Topic:",
  NewTopicCommand:"New Topic...",
  PostToAddressLabel:"or to:",
  PostValueLB:"Value (opt.):",
  MessageToPostLabel:"Message to Post:",
  EncryptedLabel:"Encrypt:",
  NoLabel:"No",
  YesLabel:"Yes",
  PostButtonCommand:"Post",

  // tab 4 - About
  AboutHTML:`BLABB.ETH


"A wyse tonge commendeth knowlege, a foolish mouth blabbeth out nothinge but
foolishnesse." --Proverbs 15:2, Miles Coverdale Bible (1535)


BLABB.ETH transmits encrypted or plain-text messaging using simple Ethereum
transfers. Point-to-point and broadcast (to topic) modes are supported.


"blabb.eth" name:
https://etherscan.io/tx/0xe3cc94b079899dc6832db20febf650c27abe405158538d77b6482b95b4d57b0f


Cryptography Warning

The ECIES implementation given here is solely based off Parity's
implementation. This module offers no guarantees as to the security or validity
of the implementation. Furthermore, this project is being actively developed
and as such should not be used for highly sensitive information.
--https://github.com/sigp/ecies-parity


Notes

* Developed for https://nwjs.io/ environment. Assumes a web3 provider
  (e.g. geth or parity) is available.

* To perform ECIES encryption and to calculate the user's public key, the
  dapp will ask the user for the passphrase and will read and decrypt the
  user's private key, temporarily and in-memory only.

* This dapp includes an unmodified copy of 
  https://github.com/ethereum/web3.js under
  https://github.com/ethereum/web3.js/blob/1.x/LICENSE

This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.

* Includes https://github.com/browserify/browserify instance of
  https://github.com/danfinlay/eth-ens-namehash, and which further includes
  https://www.npmjs.com/package/idna-uts46-hx and
  https://www.npmjs.com/package/js-sha3

* Includes https://github.com/ethereumjs/keythereum project under
  https://github.com/ethereumjs/keythereum/blob/master/LICENSE

Copyright (c) 2015: Jack Peterson.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

* Includes release of https://github.com/indutny/elliptic under
  https://github.com/indutny/elliptic#license

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

* Includes https://github.com/sigp/ecies-parity under 
  https://github.com/sigp/ecies-parity/blob/master/LICENSE

MIT License

Copyright (c) 2018 Age Manning

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


BLABB.ETH License

MIT License

Copyright (c) 2019 Bryan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`
};

function setLabels()
{
  LANG = document.getElementById( "LanguageCB" ).value;

  // HEADER

  document.getElementById("SkinLabel").innerHTML =
    STRINGS[LANG].SkinLabel;

  document.getElementById("LanguageLabel").innerHTML =
    STRINGS[LANG].LanguageLabel;

  document.getElementById( "SettingsTabButton" ).innerHTML =
    STRINGS[LANG].SettingsTabLabel;

  document.getElementById( "ViewTabButton" ).innerHTML =
    STRINGS[LANG].ViewTabLabel;

  document.getElementById( "PostTabButton" ).innerHTML =
    STRINGS[LANG].PostTabLabel;

  document.getElementById( "AboutTabButton" ).innerHTML =
    STRINGS[LANG].AboutTabLabel;

  // SETTINGS

  document.getElementById( "AddrLabel" ).innerHTML =
    STRINGS[LANG].UseAddressLabel;

  document.getElementById( "HandleLabel" ).innerHTML =
    STRINGS[LANG].UseHandleLabel;

  document.getElementById( "dAppNamespace" ).innerHTML =
    STRINGS[LANG].DAppNamespace;
  document.getElementById( "dAppNamespace2" ).innerHTML =
    STRINGS[LANG].DAppNamespace;
  document.getElementById( "dAppNamespace3" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "GetNameLegend" ).innerHTML =
    STRINGS[LANG].GetNameLegend;

  document.getElementById( "NameToGetLB" ).innerHTML =
    STRINGS[LANG].NameToGetLB;

  document.getElementById( "ForAddressLB" ).innerHTML =
    STRINGS[LANG].ForAddressLB;
  document.getElementById( "ForAddressLB2" ).innerHTML =
    STRINGS[LANG].ForAddressLB;

  document.getElementById( "ValueLB" ).innerHTML =
    STRINGS[LANG].ValueLB;

  document.getElementById( "GasEstLB" ).innerHTML =
    STRINGS[LANG].GasEstLB;

  document.getElementById( "GasEstVal" ).innerHTML =
    STRINGS[LANG].GasEstVal;

  document.getElementById( "GetHandleButton" ).innerHTML =
    STRINGS[LANG].GetHandleButtonCommand;

  document.getElementById( "GasPriceLabel" ).innerHTML =
    STRINGS[LANG].GasPriceLabel;

  document.getElementById( "GasPriceUnits" ).innerHTML =
    STRINGS[LANG].GasPriceUnits;

  document.getElementById( "LastBlocksLabel" ).innerHTML =
    STRINGS[LANG].LastBlocksLabel;

  // VIEW

  document.getElementById( "SentToLabel" ).innerHTML =
    STRINGS[LANG].SentToLabel;

  document.getElementById( "NameAddressLabel" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "TopicSelectLabel" ).innerHTML =
    STRINGS[LANG].TopicSelectLabel;

  document.getElementById( "dAppNamespaceView" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "FromLabel" ).innerHTML = STRINGS[LANG].FromLabel;

  document.getElementById( "NameAddressLabel2" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "KeywordsLabel" ).innerHTML =
    STRINGS[LANG].KeywordsLabel;

  document.getElementById( "SearchButton" ).innerHTML =
    STRINGS[LANG].SearchButtonCommand;

  document.getElementById( "MessagesLabel" ).innerHTML =
    STRINGS[LANG].MessagesLabel;

  document.getElementById( "ContentsLabel" ).innerHTML =
    STRINGS[LANG].ContentsLabel;

  document.getElementById( "BlackHexButton" ).innerHTML =
    STRINGS[LANG].BlackHexButton;

  document.getElementById( "BlackUtfButton" ).innerHTML =
    STRINGS[LANG].BlackUtfButton;

  document.getElementById( "RedHexButton" ).innerHTML =
    STRINGS[LANG].RedHexButton;

  document.getElementById( "RedUtfButton" ).innerHTML =
    STRINGS[LANG].RedUtfButton;

  // POST

  document.getElementById( "PostToTopicLabel" ).innerHTML =
    STRINGS[LANG].PostToTopicLabel;

  document.getElementById( "PostToAddressLabel" ).innerHTML =
    STRINGS[LANG].PostToAddressLabel;

  document.getElementById( "dAppNamespacePost" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "NameAddressLabel3" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "PostValueLB" ).innerHTML =
    STRINGS[LANG].PostValueLB;

  document.getElementById( "MessageToPostLabel" ).innerHTML =
    STRINGS[LANG].MessageToPostLabel;

  document.getElementById( "EncryptedLabel" ).innerHTML =
    STRINGS[LANG].EncryptedLabel;

  document.getElementById( "NoLabel" ).innerHTML = STRINGS[LANG].NoLabel;
  document.getElementById( "YesLabel" ).innerHTML = STRINGS[LANG].YesLabel;

  document.getElementById( "PostButton" ).innerHTML =
    STRINGS[LANG].PostButtonCommand;

  document.getElementById( "GetTopicLegend" ).innerHTML =
    STRINGS[LANG].GetTopicLegend;

  document.getElementById( "TopicToGetLB" ).innerHTML =
    STRINGS[LANG].TopicToGetLB;

  document.getElementById( "GetTopicValueLB" ).innerHTML =
    STRINGS[LANG].ValueLB;

  document.getElementById( "TopicGasEstLB" ).innerHTML =
    STRINGS[LANG].GasEstLB;

  document.getElementById( "TopicGasEstVal" ).innerHTML =
    STRINGS[LANG].TopicGasEstVal;

  document.getElementById( "GetTopicButton" ).innerHTML =
    STRINGS[LANG].NewTopicCommand;

  // About
  document.getElementById( "AboutTextArea").value = STRINGS[LANG].AboutHTML;
}
