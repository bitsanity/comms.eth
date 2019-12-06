function removeAll(combobox)
{
  for (let ii = combobox.options.length - 1; ii >= 0 ; ii--)
    combobox.remove( ii );
}

function setSkin() {
  let skin = document.getElementById( "SkinCB" ).value;
  console.log( "setSkin( " + skin + " )" );
  document.getElementById( "PageSkin" ).setAttribute( "href", skin );
}

function valToWei( val ) {
  if (!val || val.length == 0) return '0';

  let parts = val.trim().split( /[\s]+/ );
  let amtpart = parseFloat( parts[0] );

  for (let ii = 1; ii < parts.length; ii++) {
    if (parts[ii].toLowerCase() == 'wei')
      result = amtpart;
    else if (parts[ii].toLowerCase() == 'kwei')
      result = amtpart * 1000;
    else if (parts[ii].toLowerCase() == 'babbage')
      result = amtpart * 1000;
    else if (parts[ii].toLowerCase() == 'femtoether')
      result = amtpart * 1000;
    else if (parts[ii].toLowerCase() == 'mwei')
      result = amtpart * 1000000;
    else if (parts[ii].toLowerCase() == 'lovelace')
      result = amtpart * 1000000;
    else if (parts[ii].toLowerCase() == 'picoether')
      result = amtpart * 1000000;
    else if (parts[ii].toLowerCase() == 'gwei')
      result = amtpart * 1000000000;
    else if (parts[ii].toLowerCase() == 'shannon')
      result = amtpart * 1000000000;
    else if (parts[ii].toLowerCase() == 'nanoether')
      result = amtpart * 1000000000;
    else if (parts[ii].toLowerCase() == 'nano')
      result = amtpart * 1000000000;
    else if (parts[ii].toLowerCase() == 'szabo')
      result = amtpart * 1000000000000;
    else if (parts[ii].toLowerCase() == 'microether')
      result = amtpart * 1000000000000;
    else if (parts[ii].toLowerCase() == 'micro')
      result = amtpart * 1000000000000;
    else if (parts[ii].toLowerCase() == 'finney')
      result = amtpart * 1000000000000000;
    else if (parts[ii].toLowerCase() == 'milliether')
      result = amtpart * 1000000000000000;
    else if (parts[ii].toLowerCase() == 'milli')
      result = amtpart * 1000000000000000;
    else if (parts[ii].toLowerCase() == 'ether')
      result = amtpart * 1000000000000000000;
    else if (parts[ii].toLowerCase() == 'kether')
      result = amtpart * 1000000000000000000000;
    else if (parts[ii].toLowerCase() == 'grand')
      result = amtpart * 1000000000000000000000;
    else if (parts[ii].toLowerCase() == 'mether')
      result = amtpart * 1000000000000000000000000;
    else if (parts[ii].toLowerCase() == 'gether')
      result = amtpart * 1000000000000000000000000000;
    else if (parts[ii].toLowerCase() == 'tether')
      result = amtpart * 1000000000000000000000000000;
  }

  return Math.round( result );
}


