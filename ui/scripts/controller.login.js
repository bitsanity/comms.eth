var KeyObjs = [];

function allLoadedAccounts() {
  let result = [];
  for( let ii = 0; ii < KeyObjs.length; ii++ ) {
    result.push( KeyObjs[ii].addr );
  }
  return result;
}

function getPrivateKeyBuff( acct ) {
  let act = acct.toLowerCase();

  for( let ii = 0; ii < KeyObjs.length; ii++ ) {
    let obj = KeyObjs[ii];
    if (act === obj.addr.toLowerCase())
      return obj.privkey;
  }
  return null;
}

function getPublicKeyBuff( acct ) {
  let act = acct.toLowerCase();

  for( let ii = 0; ii < KeyObjs.length; ii++ ) {
    let obj = KeyObjs[ii];
    if (act === obj.addr.toLowerCase())
      return obj.pubkey;
  }
  return null;
}

function doLoadKey() {
  // nothing to do
}

function convertPrivateKeyToObj( privkey ) {
  let result = {
    addr : global.keythereum.privateKeyToAddress(privkey).toLowerCase(),
    pubkey : secp256k1.publicKeyCreate(privkey, false).slice(1),
    privkey : privkey
  };
  return result;
}

function doLoadGethKey() {
  let lkta = document.getElementById( "LoadKeyTextArea" );
  if (! lkta.value || lkta.value.length == 0) return;

  try {
    let gethobj = JSON.parse( lkta.value );

    let pphrase = userPrompt( STRINGS[LANG].PassphrasePrompt );
    if (!pphrase || pphrase.length == 0) return;
    let privk = global.keythereum.recover( pphrase, gethobj );

    KeyObjs.push( convertPrivateKeyToObj(privk) );
  }
  catch (err) {
    lkta.style.backgroundColor = 'yellow';
    return;
  }

  lkta.value = '';
  loadLocalAccounts();
}

function doLoadRawKey() {
  let raw = document.getElementById( "LoadRawKeyField" );

  let val = raw.value;
  if (! val || val.length == 0) return;

  if (/0x.*$/.test(val))
    val = val.substring( 2 );

  try {
    let privKey = Buffer.from( val, 'hex' );
    KeyObjs.push( convertPrivateKeyToObj(privKey) );
  }
  catch (err) {
    console.log( err.toString() );
    raw.style.backgroundColor = 'yellow';
    return;
  }

  raw.value = '';
  loadLocalAccounts();
}
