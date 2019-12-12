// I18N

var STRINGS = {};
var LANG = "";

function setLabels()
{
  LANG = document.getElementById( "LanguageCB" ).value;

  // HEADER

  document.getElementById("SkinLabel").innerHTML =
    STRINGS[LANG].SkinLabel;

  document.getElementById("LanguageLabel").innerHTML =
    STRINGS[LANG].LanguageLabel;

  document.getElementById( "SettingsTabButton" ).innerHTML =
    STRINGS[LANG].SettingsTabLabel;

  document.getElementById( "ViewTabButton" ).innerHTML =
    STRINGS[LANG].ViewTabLabel;

  document.getElementById( "PostTabButton" ).innerHTML =
    STRINGS[LANG].PostTabLabel;

  document.getElementById( "AboutTabButton" ).innerHTML =
    STRINGS[LANG].AboutTabLabel;

  document.getElementById( "LoadKeyTabButton" ).innerHTML =
    STRINGS[LANG].LoadKeyTabLabel;

  // SETTINGS

  document.getElementById( "AddrLabel" ).innerHTML =
    STRINGS[LANG].UseAddressLabel;

  document.getElementById( "HandleLabel" ).innerHTML =
    STRINGS[LANG].UseHandleLabel;

  document.getElementById( "dAppNamespace" ).innerHTML =
    STRINGS[LANG].DAppNamespace;
  document.getElementById( "dAppNamespace2" ).innerHTML =
    STRINGS[LANG].DAppNamespace;
  document.getElementById( "dAppNamespace3" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "GetNameLegend" ).innerHTML =
    STRINGS[LANG].GetNameLegend;

  document.getElementById( "NameToGetLB" ).innerHTML =
    STRINGS[LANG].NameToGetLB;

  document.getElementById( "ForAddressLB" ).innerHTML =
    STRINGS[LANG].ForAddressLB;
  document.getElementById( "ForAddressLB2" ).innerHTML =
    STRINGS[LANG].ForAddressLB;

  document.getElementById( "ValueLB" ).innerHTML =
    STRINGS[LANG].ValueLB;

  document.getElementById( "GasEstLB" ).innerHTML =
    STRINGS[LANG].GasEstLB;

  document.getElementById( "GasEstVal" ).innerHTML =
    STRINGS[LANG].GasEstVal;

  document.getElementById( "GetHandleButton" ).innerHTML =
    STRINGS[LANG].GetHandleButtonCommand;

  document.getElementById( "GasPriceLabel" ).innerHTML =
    STRINGS[LANG].GasPriceLabel;

  document.getElementById( "GasPriceUnits" ).innerHTML =
    STRINGS[LANG].GasPriceUnits;

  document.getElementById( "EthGasStationLink" ).innerHTML =
    STRINGS[LANG].EthGasStationLink;

  document.getElementById( "LastBlocksLabel" ).innerHTML =
    STRINGS[LANG].LastBlocksLabel;

  // VIEW

  document.getElementById( "SentToLabel" ).innerHTML =
    STRINGS[LANG].SentToLabel;

  document.getElementById( "NameAddressLabel" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "TopicSelectLabel" ).innerHTML =
    STRINGS[LANG].TopicSelectLabel;

  document.getElementById( "dAppNamespaceView" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "FromLabel" ).innerHTML = STRINGS[LANG].FromLabel;

  document.getElementById( "NameAddressLabel2" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "KeywordsLabel" ).innerHTML =
    STRINGS[LANG].KeywordsLabel;

  document.getElementById( "SearchButton" ).innerHTML =
    STRINGS[LANG].SearchButtonCommand;

  document.getElementById( "MessagesLabel" ).innerHTML =
    STRINGS[LANG].MessagesLabel;

  document.getElementById( "ContentsLabel" ).innerHTML =
    STRINGS[LANG].ContentsLabel;

  document.getElementById( "BlackHexButton" ).innerHTML =
    STRINGS[LANG].BlackHexButton;

  document.getElementById( "BlackUtfButton" ).innerHTML =
    STRINGS[LANG].BlackUtfButton;

  document.getElementById( "RedUtfButton" ).innerHTML =
    STRINGS[LANG].RedUtfButton;

  // POST

  document.getElementById( "PostToTopicLabel" ).innerHTML =
    STRINGS[LANG].PostToTopicLabel;

  document.getElementById( "PostToAddressLabel" ).innerHTML =
    STRINGS[LANG].PostToAddressLabel;

  document.getElementById( "dAppNamespacePost" ).innerHTML =
    STRINGS[LANG].DAppNamespace;

  document.getElementById( "NameAddressLabel3" ).innerHTML =
    STRINGS[LANG].NameAddressLabel;

  document.getElementById( "PostValueLB" ).innerHTML =
    STRINGS[LANG].PostValueLB;

  document.getElementById( "MessageToPostLabel" ).innerHTML =
    STRINGS[LANG].MessageToPostLabel;

  document.getElementById( "EncryptedLabel" ).innerHTML =
    STRINGS[LANG].EncryptedLabel;

  document.getElementById( "NoLabel" ).innerHTML = STRINGS[LANG].NoLabel;
  document.getElementById( "YesLabel" ).innerHTML = STRINGS[LANG].YesLabel;

  document.getElementById( "PostButton" ).innerHTML =
    STRINGS[LANG].PostButtonCommand;

  document.getElementById( "GetTopicLegend" ).innerHTML =
    STRINGS[LANG].GetTopicLegend;

  document.getElementById( "TopicToGetLB" ).innerHTML =
    STRINGS[LANG].TopicToGetLB;

  document.getElementById( "GetTopicValueLB" ).innerHTML =
    STRINGS[LANG].ValueLB;

  document.getElementById( "TopicGasEstLB" ).innerHTML =
    STRINGS[LANG].GasEstLB;

  document.getElementById( "TopicGasEstVal" ).innerHTML =
    STRINGS[LANG].TopicGasEstVal;

  document.getElementById( "GetTopicButton" ).innerHTML =
    STRINGS[LANG].NewTopicCommand;

  // About
  document.getElementById( "AboutTextArea").value = STRINGS[LANG].AboutHTML;

  // Load Key
  document.getElementById( "LoadKeyLabel" ).innerHTML =
    STRINGS[LANG].LoadKeyLabel;

  document.getElementById( "LoadGethKeyButton" ).innerHTML =
    STRINGS[LANG].LoadGethKeyButton;
}

// MISCELLANEOUS VIEW-LAYER STUFF

function openTab(evt, tabName)
{
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that
  // opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function removeAll(combobox)
{
  for (let ii = combobox.options.length - 1; ii >= 0 ; ii--)
    combobox.remove( ii );
}

function setSkin() {
  let skin = document.getElementById( "SkinCB" ).value;
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

