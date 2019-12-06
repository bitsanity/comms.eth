// local store: [ { hash, block from to input, fromname, pubkeyxy } ]
var MessageTable = [];

var viewRsvToAddr = '';
var viewRsvFromAddr = '';

function doView() {
  document.getElementById( "SentToInput" ).value =
    document.getElementById( "AddressesCB" ).value;
  viewToChanged();

  ΞlistTopics( topicsRetrievedCallback );
}

function viewFromChanged() {
  let fromaddr = document.getElementById( "FromAddressField" ).value;
  if (fromaddr && fromaddr.toLowerCase().endsWith('.eth'))
    ΞnameToAddress( fromaddr, viewFromResolved );
}

function viewFromResolved( val ) {
  viewRsvFromAddr = '';
}

function viewToChanged() {
  let toaddr = document.getElementById( "SentToInput" ).value;
  if (toaddr && toaddr.toLowerCase().endsWith('.eth'))
    ΞnameToAddress( toaddr, viewToResolved );
}

function viewToResolved( res ) {
  viewRsvToAddr = res;
}

function messageSelected() {
  let firstix = document.getElementById( "MessageList" ).selectedIndex();
  let area = document.getElementById( "MessageContentsTextArea" );

  if (firstix < 0) {
    area.value = "";
    return;
  }

  area.value = MessageTable[firstix].input;
}

function topicsRetrievedCallback( topics ) {
  let topicsCB = document.getElementById( "ViewTopicsCB" );
  removeAll( topicsCB );

  for (ii = 0; ii < topics.length; ii++) {
    let op = document.createElement("option");
    op.text = topics[ii];
    topicsCB.add( op );
  }

  topicsCB = document.getElementById( "PostToTopicCB" );
  removeAll( topicsCB );

  for (ii = 0; ii < topics.length; ii++) {
    let op = document.createElement("option");
    op.text = topics[ii];
    topicsCB.add( op );
  }
}

function doSearch() {
  let blocks = parseInt( document.getElementById("LastBlocksLabel") );
  let toaddr = document.getElementById( "SentToInput" ).value;
  let totopic = document.getElementById( "ViewTopicsCB" ).value +
                  STRINGS[LANG].DAppNamespace;
  let fromaddr = document.getElementById( "FromAddressField" ).value;
  let keywords = document.getElementById( "KeywordsField" ).value;
 
  ΞretrieveMessages(
    blocks,
    (viewRsvToAddr && viewRsvToAddr.length > 0) ? viewRsvToAddr : toaddr,
    totopic,
    (viewRsvFromAddr && viewRsvFromAddr.length > 0) ? viewRsvFromAddr
                                                    : fromaddr,
    keywords,
    retrieveMessagesCallback );
}

function retrieveMessagesCallback( messages ) {
  MessageTable = [];
  removeAll( document.getElementById("MessageList") );

  for (let ii = 0; ii < messages.length; ii++) {
    MessageTable.push( messages[ii] );
  }

  for (let ii = 0; ii < messages.length; ii++) {
    ΞaddressToName( messages[ii].hash, messages[ii].from, nameResolved )
  }

  // allow time for address lookups to complete before rendering
  setTimeout( refreshMessageList, 1500 /* 1.5 seconds, in ms */ );
}

function nameResolved( hash, name ) {
  for( let ii = 0; ii < MessageTable.length; ii++ )
    if (MessageTable[ii].hash == hash)
      MessageTable[ii].fromname = name;

  ΞgetPublicKey( hash, name, pubkeyResolved );
}

function pubkeyResolved( hash, pubkeyxy ) {
  for( let ii = 0; ii < MessageTable.length; ii++ )
    if (MessageTable[ii].hash == hash)
      MessageTable[ii].pubkeyxy = pubkeyxy;
}

// just render whatever is in the Header variable
function refreshMessageList() {
  let list = document.getElementById( "MessageList" );

  // hash => { hash, block, from, to, input, fromname }
  for (let ii = 0; ii < MessageTable.length; ii++) {
    let msg = MessageTable[ii];

    let opt = document.createElement("option");
    opt.text =
      padLeft( '' + msg.block, 8, ' ' ) +
               ' ' +
               padRight( (msg.fromname) ? msg.fromname : msg.from, 44, ' ' );
    list.add( opt );
  }
}

function padLeft( str, len, ch ) {
  if (str.length >= len) return str;

  let res = '';
  for (let ix = 0; ix < len - str.length; ix++)
    res = res.concat( ch );

  res.concat( str );
  return res;
}

function padRight( str, len, ch ) {
  let res = str;
  for (let ix = str.length; ix < len; ix++)
    res = res.concat( ch );
}

function doRawHex() {
  let firstix = document.getElementById( "MessageList" ).selectedIndex;
  let area = document.getElementById( "MessageContentsTextArea" );
  if (firstix < 0) return;
  area.value = MessageTable[firstix].input;
}

function doRawUtf() {
  console.log( 'doRawUtf()' );
  doRawHex();
  let area = document.getElementById( "MessageContentsTextArea" );
  if (area.value && area.value.length > 0)
    area.value = ΞhexToUtf( area.value );
}

function decryptHex( blackhexstr, senderpubkeyxy, acct ) {
  let blackdata = ΞhexToBytes( blackhexstr );

  let msg = "decrypt\n\n" + STRINGS[LANG].PassphrasePrompt;
  var pphrase = prompt( msg );
  if (pphrase == null || pphrase.length == 0) return;

  let mykey = ΞloadKey( acct, acctPass );

  return ecies.decrypt( mykey.privkey, blackdata ); // returns promise
}

function doRedHex() {
  console.log( 'doRedHex()' );
  let firstix = document.getElementById( "MessageList" ).selectedIndex;
  let area = document.getElementById( "MessageContentsTextArea" );
  if (firstix < 0) return;

  let msg = MessageTable[firstix];

  if (!msg.fromname || msg.fromname.length < 42) {
    alert( "sender name required" );
    return;
  }

  let pubkeyxy = msg.pubkeyxy;
  if (!pubkeyxy || pubkeyxy.length == 0) {
    alert( "sender's public key required" );
    return;
  }

  decryptHex( msg.input, pubkeyxy, AcctCB.value ).then( (redtext) => {
    area.value = redtext;
  } );
}

function doRedUtf() {
  console.log( 'doRedUtf()' );
  doRedHex();
  let area = document.getElementById( "MessageContentsTextArea" );
  if (area.value && area.value.length > 0)
    area.value = ΞhexToUtf( area.value );
}
