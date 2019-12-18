function doSettings() {
  ΞlocalAccounts( localAccountsCallback );
  ΞnetworkGasPrice( networkGasPriceCallback );
}

function localAccountsCallback( eaccts ) {
  let addrcb = document.getElementById( "AddressesCB" );

  let selected = addrcb.value;
  removeAll( addrcb );

  for (ii = 0; ii < eaccts.length; ii++)
  {
    let op = document.createElement("option");
    op.text = eaccts[ii];
    addrcb.add( op );
  }

  if (selected && selected.length > 0) {
    addrcb.value = selected;
    document.getElementById( "GetNameAddressValue" ).innerHTML = selected;
    document.getElementById( "GetTopicAddressValue" ).innerHTML = selected;
  }
  else {
    document.getElementById( "GetNameAddressValue" ).innerHTML = eaccts[0];
    document.getElementById( "GetTopicAddressValue" ).innerHTML = eaccts[0];
  }

  if (selected)
    ΞlistNamesForAccount( addrcb.value, setHandlesCallback );
}

function setHandlesCallback( ehandles ) {
  let combo = document.getElementById( "HandleCB" );
  removeAll( combo );

  for (ii = 0; ii < ehandles.length; ii++) {
    let op = document.createElement("option");
    op.text = ehandles[ii];
    combo.add( op );
  }
}

function networkGasPriceCallback( gpricegwei ) {
  document.getElementById( "GasTextField" ).value = gpricegwei;
}

function selectedAddress() {
  ΞlistNamesForAccount( document.getElementById("AddressesCB").value,
    setHandlesCallback );

  document.getElementById( "GetNameAddressValue" ).innerHTML =
    document.getElementById( "AddressesCB" ).value;
  document.getElementById( "GetTopicAddressValue" ).innerHTML =
    document.getElementById( "AddressesCB" ).value;
}

function doGetHandle() {
  let newname = LabelField.value;

  const deny = /[^\w\d]/;
  if ( deny.test(newname) ) {
    LabelField.value = "";
    return;
  }

  if (newname)
    ΞnameExists( newname, nameCheckCB );
}

function doGetTopic() {
  let newtop = TopicField.value;

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
    userAlert( STRINGS[LANG].NameAlreadyTaken );
    return;
  }

  let newname =
    namehash.normalize( document.getElementById( "LabelField" ).value );
  let acct = document.getElementById( "AddressesCB" ).value;
  let val = document.getElementById( "GetHandleValueField" ).value;
  let gasprice = document.getElementById( "GasTextField" ).value;

  let msg =
    newname + STRINGS[LANG].DAppNamespace + "\n" +
    "{from:" + acct + ",to:ens://blabb.eth," +
    "gas:150000,gasPrice:" + gasprice + "000000000," +
    "value:" + val + "}\n" +
    "{from:" + acct + ",to:ens://addr.reverse," +
    "gas:100000,gasPrice:" + gasprice + "000000000} " +
    "\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = userPrompt( msg );
  if (pphrase == null || pphrase.length == 0) return;

  val = valToWei( val );
  ΞmakeName( acct, pphrase, newname, val, gasprice * 1000000000 );

  LabelField.value = "";
}

function topicCheckCB( exists ) {
  if (exists) {
    userAlert( STRINGS[LANG].TopicAlreadyTaken );
    return;
  }

  let newtop = document.getElementById( "TopicField" ).value;
  let acct = document.getElementById( "AddressesCB" ).value;
  let val = document.getElementById( "GetTopicValueField" ).value;
  let gasprice = document.getElementById( "GasTextField" ).value;

  let msg =
    newtop + STRINGS[LANG].DAppNamespace + "\n" +
    "{from:" + acct + ",to:ens://blabb.eth," +
    "gas:100000,gasPrice:" + gasprice + "000000000," +
    "value:" + val + "}\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = userPrompt( msg );
  if (pphrase == null || pphrase.length == 0) return;

  val = valToWei( val );
  ΞmakeTopic( acct, pphrase, newtop, val, gasprice * 1000000000 );

  TopicField.value = "";
}
