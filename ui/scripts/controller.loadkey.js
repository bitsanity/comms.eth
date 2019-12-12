var KeyObjs = [];

function getPrivateKey( acct ) {
  let act = acct.startsWith("0x") ? acct.substring(2).toLowerCase()
                                  : acct.toLowerCase();

  for( let ii = 0; ii < KeyObjs.length; ii++ ) {
    let obj = KeyObjs[ii];
    if (act == obj.address.toLowerCase())
      return obj;
  }

  return null;
}

function doLoadKey() {
}

function doLoadGethKey() {
  let lkta = document.getElementById( "LoadKeyTextArea" );
  let keytext = lkta.value;

  if (!keytext || keytext.length == 0) return;
  let keyobj = JSON.parse( keytext );

  if (null != getPrivateKey(keyobj.address)) return;

  if (keyobj.address && keyobj.address.length > 0) {
    KeyObjs.push( keyobj );
    lkta.value = '';
  }
}

