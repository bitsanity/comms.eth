function doSettings() {
  ΞnetworkGasPrice( networkGasPriceCallback );

  ΞnamekeyFee( (nf) => {
    document.getElementById( "GetHandleValueField" ).value =
      ΞweiToSzabo(nf) + ' szabo';
  } );

  ΞtopicFee( (tf) => {
    document.getElementById( "GetTopicValueField" ).value =
      ΞweiToFinney(tf) + ' finney';
  } );

  loadLocalAccounts();
  document.getElementById( "GasEstVal" ).value = GASREGISTER;
  document.getElementById( "TopicGasEstVal" ).value = GASTOPIC;
}

function wsUrlChanged() {
  let wsurl = document.getElementById( "WSURLValue" );
  let val = wsurl.value;

  Ξconnect( val,
    err => {
      setTimeout( setWeb3StatusIndicator(false), 200 );
    },
    () => {
      setTimeout( setWeb3StatusIndicator(true), 200 );
      setTimeout( doSettings, 200 );
    } );
}

function setWeb3StatusIndicator( yn ) {
  let fld = document.getElementById( "WSURLValue" );
  if (yn) {
    fld.style.color = 'green';
  }
  else fld.style.color = 'red';
}

function myGasPriceSetting() {
  return document.getElementById( "GasTextField" ).value * 1000000000;
}

function nameGasChanged() {
  let gasfld = document.getElementById( "GasEstVal" );
  try {
    let it = parseInt( gasfld.value );
    if (isNaN(it)) throw "bad user";
    GASREGISTER = it;
    gasfld.style.backgroundColor = 'inherit';
  }
  catch(err) {
    gasfld.style.backgroundColor = 'yellow';
  }
}

function topicGasChanged() {
  let gasfld = document.getElementById( "TopicGasEstVal" );
  try {
    let it = parseInt( gasfld.value );
    if (isNaN(it)) throw "bad user";
    GASTOPIC = it;
    gasfld.style.backgroundColor = 'inherit';
  }
  catch(err) {
    gasfld.style.backgroundColor = 'yellow';
  }
}

function loadLocalAccounts() {
  let eaccts = allLoadedAccounts();
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

  document.getElementById( "SentToInput" ).value = 
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
  let gasprix = myGasPriceSetting();

  if (! userConfirmTransaction('registerLabelAndKey( ' + newname + ' )',
    acct, val, GASREGISTER, gasprix)) return;

  val = valToWei( val );
  ΞmakeName( acct, newname, val, gasprix,
    err => {
      userAlert( err );
    },
    res => {
      let fqname = newname + STRINGS[LANG].DAppNamespace;
      ΞsetResolver( acct, fqname, gasprix,
        err => {
          userAlert( err );
        },
        res2 => {
          userAlert( 'TX: ' + res2 );
        } );
    } );

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
  let gasprix = myGasPriceSetting();

  if (! userConfirmTransaction('registerTopic( ' + newtop + ' )',
    acct, val, GASTOPIC, gasprix)) return;

  val = valToWei( val );
  ΞmakeTopic( acct, newtop, val, gasprix,
    err => {
      userAlert( err );
    },
    res => {
      let fqname = newtop + STRINGS[LANG].DAppNamespace;
      ΞsetResolver( acct, fqname, gasprix,
        err => {
          userAlert( err );
        },
        res2 => {
          userAlert( 'TX: ' + res2 );
        } );
     } );

  TopicField.value = "";
}
