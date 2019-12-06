var AddrCB;

function doSettings() {
  AddrCB = document.getElementById( "AddressesCB" );
  ΞlocalAccounts( localAccountsCallback );
  ΞnetworkGasPrice( networkGasPriceCallback );
}

function localAccountsCallback( eaccts ) {
  let selected = AddrCB.value;
  removeAll( AddrCB );

  for (ii = 0; ii < eaccts.length; ii++)
  {
    let op = document.createElement("option");
    op.text = eaccts[ii];
    AddrCB.add( op );

    if (ii == 0) {
      document.getElementById( "GetNameAddressValue" ).innerHTML = eaccts[0];
      document.getElementById( "GetTopicAddressValue" ).innerHTML = eaccts[0];
    }
  }

  if (selected && selected.length > 0)
    AddrCB.value = selected;

  ΞlistNamesForAccount( AddrCB.value, setHandlesCallback );
}

function setHandlesCallback( ehandles ) {
  let HandleCB = document.getElementById( "HandleCB" );
  removeAll( HandleCB );

  for (ii = 0; ii < ehandles.length; ii++) {
    let op = document.createElement("option");
    op.text = ehandles[ii];
    HandleCB.add( op );
  }
}

function networkGasPriceCallback( gpricegwei ) {
  document.getElementById( "GasTextField" ).value = gpricegwei;
}

function selectedAddress() {
  ΞlistNamesForAccount( AddrCB.value, setHandlesCallback );
  document.getElementById( "GetNameAddressValue" ).innerHTML = AddrCB.value;
  document.getElementById( "GetTopicAddressValue" ).innerHTML = AddrCB.value;
}

function doGetHandle() {
  let newname = document.getElementById( "LabelField" ).value;

  const deny = /[^\w\d]/;
  if ( deny.test(newname) ) {
    document.getElementById( "LabelField" ).value = "";
    return;
  }

  if (newname)
    ΞnameExists( newname, nameCheckCB );
}

function doGetTopic() {
  let newtop = document.getElementById( "TopicField" ).value;

  const deny = /[^\w\d]/;
  if ( deny.test(newtop) ) {
    document.getElementById( "TopicField" ).value = "";
    return;
  }

  if (newtop)
    ΞnameExists( newtop, topicCheckCB );
}

function nameCheckCB( exists ) {
  if (exists) {
    alert( STRINGS[LANG].NameAlreadyTaken );
    return;
  }

  let newname = document.getElementById( "LabelField" ).value;
  let acct = document.getElementById( "AddressesCB" ).value;
  let val = document.getElementById( "GetHandleValueField" ).value;
  let gasprice = document.getElementById( "GasTextField" ).value;

  let msg =

    "register name " + newname + STRINGS[LANG].DAppNamespace + "\n\n" +

    "{ from: " + acct + ", to: ens://blabb.eth, " +
    "gas: 150000, gasPrice: " + gasprice + "000000000, " +
    "value: " + val + " }\n\n" +

    "{ from: " + acct + ", to: ens://addr.reverse, " +
    "gas: 150000, gasPrice: " + gasprice + "000000000 } " +

    "\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = prompt( msg );
  if (pphrase == null || pphrase.length == 0) return;

  val = valToWei( val );
  ΞmakeName( acct, pphrase, newname, val, gasprice * 1000000000 );

  document.getElementById( "LabelField" ).value = "";
}

function topicCheckCB( exists ) {
  if (exists) {
    alert( STRINGS[LANG].TopicAlreadyTaken );
    return;
  }

  let newtop = document.getElementById( "TopicField" ).value;
  let acct = document.getElementById( "AddressesCB" ).value;
  let val = document.getElementById( "GetHandleValueField" ).value;
  let gasprice = document.getElementById( "GasTextField" ).value;

  let msg =
    "register topic " + newtop + STRINGS[LANG].DAppNamespace + "\n\n" +
    "{ from: " + acct + ", to: ens://blabb.eth, " +
    "gas: 100000, gasPrice: " + gasprice + "000000000, " +
    "value: " + val + " }\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = prompt( msg );
  if (pphrase == null || pphrase.length == 0) return;

  val = valToWei( val );
  ΞmakeTopic( acct, pphrase, newtop, val, gasprice * 1000000000 );

  document.getElementById( "TopicField" ).value = "";
}
