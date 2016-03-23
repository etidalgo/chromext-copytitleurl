// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// chrome.contextMenus - Google Chrome <https://developer.chrome.com/extensions/contextMenus>
// Sample Extensions - Google Chrome <https://developer.chrome.com/extensions/samples#search:contextmenus>


// The onClicked callback function.
function onClickHandler(info, tab) {
  if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
    console.log("radio item " + info.menuItemId +
                " was clicked (previous checked state was "  +
                info.wasChecked + ")");
  } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
    console.log(JSON.stringify(info));
    console.log("checkbox item " + info.menuItemId +
                " was clicked, state is now: " + info.checked +
                " (previous state was " + info.wasChecked + ")");

  } else {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Copy To Clipboard in Google Chrome Extensions using Javascript. Source: http://www.pakzilla.com/2012/03/20/how-to-copy-to-clipboard-in-chrome-extension/ · GitHub <https://gist.github.com/joeperrin-gists/8814825>
function copyToClipboard(text) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
};


function getClickHandler() {
	return function(info, tab) {
		var title = tab.title;
		if (title=='')(title='Untitled');

		var fulltxt = title + ' <' + tab.url + '>\r\n';
		copyToClipboard(fulltxt);
		
	};
};

function CopyAndCite(info, tab) {

		var title = tab.title;
		if (title=='')(title='Untitled');

		var fullText = title + ' <' + tab.url + '>\r\n';
		if (info.selectionText !== null) {
			fullText = fullText + info.selectionText;
		}		
		copyToClipboard(fullText);
		
};

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // var contexts = ["page","selection","link","editable","image","video", "audio"];

  chrome.contextMenus.create(
  {
	  "title": "Copy Title and URL", 
	  "id": "btnCopyTitle",
	  "type" : "normal",
	  "contexts": ["all"],
	  "onclick": getClickHandler() 
	}, function() {
    if (chrome.extension.lastError) {
      console.log("Got expected error: " + chrome.extension.lastError.message);
    }
  });
  
  chrome.contextMenus.create(
  {
	  "title": "Copy and Cite", 
	  "id": "btnCopyAndCite",
	  "type" : "normal",
	  "contexts": ["selection"],
	  "onclick": CopyAndCite 
	}, function() {
    if (chrome.extension.lastError) {
      console.log("Got expected error: " + chrome.extension.lastError.message);
    }
  });

});
