var postSelectedTopicAddr = '';
var postRsvToAddr = '';
var postRsvToPubkey = ''; // '04' + x + y

function doPost() {
}

function postTopicSelected() {
  let topic = document.getElementById( "PostToTopicCB" ).value.trim();
  if (!topic || topic.length == 0) return;
  topic = topic + STRINGS[LANG].DAppNamespace;
  ΞnameToAddress( topic, postTopicResolved );
}

function postTopicResolved( addr ) {
  postSelectedTopicAddr = addr;
}

function postToChanged() {
  let toaddr = document.getElementById( "PostToInput" ).value;
  if (toaddr && toaddr.toLowerCase().endsWith('.eth'))
    ΞnameToAddress( toaddr, postToResolved );
}

function postToResolved( res ) {
  postRsvToAddr = res;
  if (res && ΞisAddress(res))
    ΞgetPublicKey( '0x0', document.getElementById( "PostToInput" ).value +
                          STRINGS[LANG].DAppNamespace, postToResolvedPubkey );
}

function postToResolvedPubkey( hash, pubkeyxy ) {
  if (pubkeyxy && pubkeyxy.length == 2)
    postRsvToPubkey = '04' + pubkeyxy[0] + pubkeyxy[1];
}

function doPostMessage() {

  let acct = AddrCB.value;
  let gasprice = document.getElementById( "GasTextField" ).value + "000000000";
  let encrypt = document.getElementById( "RadioYes" ).checked;
  let topic = document.getElementById( "PostToTopicCB" ).value.trim();
  let toaddr = document.getElementById( "PostToInput" ).value;
  let valinc = valToWei( document.getElementById( "PostValueField" ).value );
  let message = document.getElementById( "MessageToPostTextArea" ).value;

  if (    !ΞisAddress(toaddr)
       && !ΞisAddress(postRsvToAddr)
       && !ΞisAddress(postSelectedTopicAddr) ) {
    alert( "'To' is either not an address or is an unresolved name." );
    return;
  }

  if (!message || message.length == 0) {
    alert( "No message." );
    return;
  }

  if (topic && topic.length > 0 && encrypt) {
    alert( "Cannot encrypt messages sent to topic." );
    document.getElementById( "RadioYes" ).checked = false;
    document.getElementById( "RadioNo" ).checked = true;
    return;
  }

  if (!acct || !ΞisAddress(acct)) {
    alert( "Sending address not set." );
    return;
  }

  if (topic && ΞisAddress(postSelectedTopicAddr))
    toaddr = postSelectedTopicAddr;
  else if (ΞisAddress(postRsvToAddr))
    toaddr = postRsvToAddr;

  if (!ΞisAddress(toaddr)) {
    alert( "To address invalid." );
    return;
  }

  message = Buffer.from( message );

  if (encrypt && postRsvToPubkey && postRsvToPubkey.length == 2) {
    ecies.encrypt( postRsvToPubkey, message ).then( (encrypted) => {
      sendMessage( toaddr, acct, valinc, gasprice, ΞbytesToHex(encrypted) );
      return;
    } );
  }

  sendMessage( toaddr, acct, valinc, gasprice, ΞbytesToHex(message) );
}

function sendMessage( toaddr, acct, valinc, gasprice, messagehex ) {

  let pphrmsg = "sendTransaction\n\n" +
    "{from: " + acct + ", to: " + toaddr + ", value: " + valinc +
    ", gas: 50000, gasPrice: " + gasprice + ", data: " + messagehex + "}" +
    "\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = prompt( pphrmsg );

  ΞpostMessage( toaddr, acct, pphrase, valinc, messagehex );
}

