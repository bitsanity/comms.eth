var postSelectedTopicAddr = '';
var postRsvToAddr = '';
var postRsvToPubkey = '';

var posterHasPubkey = false;

function doPost() {
  ΞlistTopics( postTopicsRetrievedCallback );
  document.getElementById( "PostToInput" ).value = '';
  posterHasPubkey = false;

  // nobody can decrypt unless poster has an ENS public key
  let acct = document.getElementById( "AddressesCB" ).value;
  ΞhasPubkey( acct, function(res) { posterHasPubkey = res; } );
}

function postTopicsRetrievedCallback( topics ) {
  let pttcb = document.getElementById( "PostToTopicCB" );
  removeAll( pttcb );

  for (ii = 0; ii < topics.length; ii++) {
    let op = document.createElement("option");
    op.text = topics[ii];
    pttcb.add( op );
  }
}

function postTopicSelected() {
  let topic = document.getElementById( "PostToTopicCB" ).value.trim();
  if (!topic || topic.length == 0)
    return;

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
  console.log( 'postToResolved: ' + res );
  postRsvToAddr = res;
  if (res && ΞisAddress(res))
    ΞgetPublicKey( '0x0', document.getElementById( "PostToInput" ).value,
      postToResolvedPubkey );
}

function postToResolvedPubkey( hash, pubkeyxy ) {
  console.log( 'postToResolvedPubkey: ' + JSON.stringify(pubkeyxy) );
  if (!pubkeyxy || pubkeyxy.length == 0)
    return;

  postRsvToPubkey = "04";
  if (pubkeyxy[0].startsWith("0x"))
    postRsvToPubkey += pubkeyxy[0].substring(2);
  else
    postRsvToPubkey += pubkeyxy[0];
  if (pubkeyxy[1].startsWith("0x"))
    postRsvToPubkey += pubkeyxy[1].substring(2);
  else
    postRsvToPubkey += pubkeyxy[1];
}

function doPostMessage() {

  let acct = document.getElementById( "AddressesCB" ).value;
  let gasprice = document.getElementById( "GasTextField" ).value + "000000000";
  let encrypt = document.getElementById( "RadioYes" ).checked;
  let topic = document.getElementById( "PostToTopicCB" ).value.trim();
  let toaddr = document.getElementById( "PostToInput" ).value;
  let valinc = valToWei( document.getElementById( "PostValueField" ).value );
  let message = document.getElementById( "MessageToPostTextArea" ).value;

  if (    !ΞisAddress(toaddr)
       && !ΞisAddress(postRsvToAddr)
       && !ΞisAddress(postSelectedTopicAddr) ) {
    alert( STRINGS[LANG].PostInvalidAlert );
    return;
  }

  if (!message || message.length == 0) {
    alert( STRINGS[LANG].PostNoMessageAlert );
    return;
  }

  if (topic && topic.length > 0 && encrypt) {
    alert( STRINGS[LANG].PostNoEncryptForTopicAlert );
    document.getElementById( "RadioYes" ).checked = false;
    document.getElementById( "RadioNo" ).checked = true;
    return;
  }

  if (!acct || !ΞisAddress(acct)) {
    alert( STRINGS[LANG].PostNoSenderAlert );
    return;
  }

  if (topic && ΞisAddress(postSelectedTopicAddr))
    toaddr = postSelectedTopicAddr;
  else if (ΞisAddress(postRsvToAddr))
    toaddr = postRsvToAddr;

  if (!ΞisAddress(toaddr)) {
    alert( STRINGS[LANG].PostToAddrInvalidAlert );
    return;
  }

  if (encrypt && postRsvToPubkey && postRsvToPubkey.length > 0) {

    if (!posterHasPubkey) {
      let yn = confirm( STRINGS[LANG].PostSenderHasNoPubkeyAlert );
      if (!yn) return;
    }

    let msgbytes = Buffer.from( message );
    let key = Buffer.from( postRsvToPubkey,'hex' );

    ecies.encrypt( key, msgbytes )
    .then( (encrypted) => {
      sendMessage( toaddr, acct, valinc, gasprice, ΞbytesToHex(encrypted) );
      return;
    } );
  }
  else {
    var yn = confirm( "send unencrypted?" );
    if (yn) {
      sendMessage( toaddr, acct, valinc, gasprice, ΞutfToHex(message) );
    }
  }
}

function sendMessage( toaddr, acct, valinc, gasprice, messagehex ) {

  let pphrmsg = "sendTransaction\n\n" +
    "{from: " + acct + ", to: " + toaddr + ", value: " + valinc +
    ", gas: 50000, gasPrice: " + gasprice + ", data: " + messagehex + "}" +
    "\n\n" + STRINGS[LANG].PassphrasePrompt;

  var pphrase = prompt( pphrmsg );

  ΞpostMessage( toaddr, acct, pphrase, valinc, messagehex, gasprice );
  document.getElementById( "MessageToPostTextArea" ).value = '';
}

