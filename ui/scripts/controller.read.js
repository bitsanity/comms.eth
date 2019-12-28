// [ { hash, block, from, to, input, fromname, pubkeyxy } ]
var MessageTable = [];

var viewRsvToAddr = '';
var viewRsvTopicAddr = '';
var viewRsvFromAddr = '';

function doView() {
  document.getElementById( "SentToInput" ).value =
    document.getElementById( "AddressesCB" ).value;
  viewToChanged();

  document.getElementById( "MessageContentsTextArea" ).value = '';
  removeAll( document.getElementById("MessageList") );

  ΞlistTopics( topicsRetrievedCallback );
}

function viewFromChanged() {
  let fromaddr = document.getElementById( "FromAddressField" ).value;
  if (fromaddr.toLowerCase().endsWith('.eth')) {
    ΞnameToAddress( fromaddr, viewFromResolved );
  }
  else
    viewRsvFromAddr = '';
}

function viewFromResolved( val ) {
  viewRsvFromAddr = val;
}

function viewToChanged() {
  let toaddr = document.getElementById( "SentToInput" ).value;
  if (toaddr.toLowerCase().endsWith('.eth'))
    ΞnameToAddress( toaddr, viewToResolved );
  else
    viewRsvToAddr = '';
}

function viewToResolved( res ) {
  viewRsvToAddr = res;
}

function viewTopicSelected() {
  let sel = document.getElementById( "ViewTopicsCB" ).value;
  if (!sel || sel.length == 0) {
    viewRsvTopicAddr = '';
    return;
  }

  SentToInput.value = '';
  sel += STRINGS[LANG].DAppNamespace;
  ΞnameToAddress( sel, viewTopicResolved );
}

function viewTopicResolved( addr ) {
  viewRsvTopicAddr = addr;
}

function messageSelected() {
  let firstix = document.getElementById( "MessageList" ).selectedIndex;
  let mcta = document.getElementById( "MessageContentsTextArea" );

  if (firstix < 0) {
    mcta.value = "";
    return;
  }

  mcta.value = MessageTable[firstix].input;
  document.getElementById( "RawHexRB" ).checked = true;
}

function topicsRetrievedCallback( topics ) {
  let vtcb = document.getElementById( "ViewTopicsCB" );
  removeAll( vtcb );

  for (ii = 0; ii < topics.length; ii++) {
    let op = document.createElement("option");
    op.text = topics[ii];
    vtcb.add( op );
  }

  let ptcb = document.getElementById( "PostToTopicCB" );
  removeAll( ptcb );

  for (ii = 0; ii < topics.length; ii++) {
    let op = document.createElement("option");
    op.text = topics[ii];
    ptcb.add( op );
  }
}

function doSearch() {
  let blocks = parseInt( document.getElementById("LastBlocksField").value );
  let toaddr = document.getElementById( "SentToInput" ).value;
  let fromaddr = document.getElementById( "FromAddressField" ).value;
  let keywords = document.getElementById( "KeywordsField" ).value;
 
  let toval = (viewRsvTopicAddr && viewRsvTopicAddr.length > 0)
              ? viewRsvTopicAddr
              : (viewRsvToAddr && viewRsvToAddr.length > 0)
                ? viewRsvToAddr
                : toaddr;

  let fromval = (viewRsvFromAddr && viewRsvFromAddr.length > 0)
                 ? viewRsvFromAddr
                 : fromaddr;

  ΞretrieveMessages( blocks, toval, fromval, keywords,
                     retrieveMessagesCallback );

  document.getElementById( "MessageContentsTextArea" ).value = '';
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
    if (MessageTable[ii].hash == hash) {
      MessageTable[ii].fromname = name;
    }

  ΞgetPublicKey( hash, name, pubkeyResolved );
}

function pubkeyResolved( hash, pubkeyxy ) {

  for( let ii = 0; ii < MessageTable.length; ii++ ) {
    if (MessageTable[ii].hash == hash) {
      if (    parseInt(pubkeyxy[0],16) == 0
           && parseInt(pubkeyxy[0],16) == 0 ) {
        MessageTable[ii].pubkeyxy = '';
      }
      else {
        MessageTable[ii].pubkeyxy = "04" +

          ((pubkeyxy[0].startsWith("0x"))
           ? pubkeyxy[0].substring(2)
           : pubkeyxy[0]) +

          ((pubkeyxy[1].startsWith("0x"))
           ? pubkeyxy[1].substring(2)
           : pubkeyxy[1]);
      }
    }
  }
}

// just render whatever is in the Header variable
function refreshMessageList() {
  let list = document.getElementById( "MessageList" );

  for (let ii = 0; ii < MessageTable.length; ii++) {
    let msg = MessageTable[ii];
    let opt = document.createElement( "option" );
    opt.text = padRight( '' + msg.block, 9, '0' ) +
               ' ' +
               padLeft( (msg.fromname && msg.fromname.length > 0)
                          ? msg.fromname
                          : msg.from, 42, '.' );
    list.add( opt );
  }
}

function padLeft( str, len, ch ) {
  let res = str;
  for (let ix = str.length; ix < len; ix++)
    res = res.concat( ch );

  return res;
}

function padRight( str, len, ch ) {
  let res = '';
  for (let ix = str.length; ix < len; ix++)
    res = res.concat( ch );
  res = res.concat( str );
  return res;
}

function doRawHex() {
  let firstix = document.getElementById( "MessageList" ).selectedIndex;
  if (firstix < 0) return;
  document.getElementById( "MessageContentsTextArea" ).value =
    MessageTable[firstix].input;

  document.getElementById("MessageContentsTextArea" ).className = "data";
}

function doRawUtf() {
  doRawHex();
  let mcta = document.getElementById( "MessageContentsTextArea" );
  let val = mcta.value;
  if (val && val.length > 0)
    mcta.value = ΞhexToUtf( val );

  document.getElementById("MessageContentsTextArea" ).className = "data";
}

function decryptHex( blackhexstr, senderpubkeyxy, acct ) {

  let blackdata = Buffer.from( ΞhexToBytes(blackhexstr) );
  let privKey = getPrivateKeyBuff( acct );

  if (!privKey) {
    userAlert( STRINGS[LANG].ViewNoPrivateKeyAlert + " " + acct );
    return;
  }

  return ecies.decrypt( privKey, blackdata ); // returns a Promise
}

function doRedUtf() {
  let firstix = document.getElementById( "MessageList" ).selectedIndex;
  if (firstix < 0) return;

  let msg = MessageTable[firstix];

  if (!msg.fromname || msg.fromname.length == 0) {
    userAlert( STRINGS[LANG].ViewSenderNameAlert );
    return;
  }

  if (!msg.pubkeyxy || msg.pubkeyxy.length == 0) {
    userAlert( STRINGS[LANG].ViewSenderPubkeyAlert );
    return;
  }

  let key = Buffer.from( msg.pubkeyxy, 'hex' );
  decryptHex( msg.input,
              msg.pubkeyxy,
              document.getElementById("AddressesCB").value )
  .then( (redtext) => {
    document.getElementById("MessageContentsTextArea" ).className = "reddata";
    document.getElementById("MessageContentsTextArea" ).value = redtext;
  } );
}

