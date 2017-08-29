// Copyright (c) 2016 E Tidalgo. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Diverged from Chromium code March 2016
// chrome.contextMenus - Google Chrome <https://developer.chrome.com/extensions/contextMenus>
// Sample Extensions - Google Chrome <https://developer.chrome.com/extensions/samples#search:contextmenus>

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
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Copy To Clipboard in Google Chrome Extensions using Javascript. Source: http://www.pakzilla.com/2012/03/20/how-to-copy-to-clipboard-in-chrome-extension/ � GitHub <https://gist.github.com/joeperrin-gists/8814825>
function copyToClipboard(text) {
    const input = document.createElement("textarea");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
}

function getClickHandler() {
    return function(info, tab) {
        var title = tab.title;
        if (title=="")(title="Untitled");

        var fulltxt = title + " <" + tab.url + ">\r\n";
        copyToClipboard(fulltxt);
    };
}

function copyTitleAndUrlToClipboard(info, tab) {
    const titleAndUrl = getTitleAndUrl(info, tab);
    copyToClipboard(titleAndUrl);
}

function getTitleAndUrl(info, tab) {
    var title = tab.title;
    if (title=="") {
        title="Untitled";
    }

    return title + " <" + tab.url + ">\r\n";
}

function copyAndCite(info, tab) {

    var title = tab.title;
    if (title=="")(title="Untitled");

    var fullText = title + " <" + tab.url + ">\r\n";
    if (info.selectionText !== null) {
        fullText = fullText + info.selectionText;
    }		
    copyToClipboard(fullText);
}

/**
 * Send the value that should be pasted to the content script.
 */
function sendPasteToContentScript(toBePasted) {
    // We first need to find the active tab and window and then send the data
    // along. This is based on:
    // https://developer.chrome.com/extensions/messaging
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: toBePasted});
    });
}

function insertName(info, tab) {
    console.log("Insert name");
    if ( info.editable) {
        console.log("Editable");
        sendPasteToContentScript("test");
    }
}

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // var contexts = ["page","selection","link","editable","image","video", "audio"];

    chrome.contextMenus.create(
        {
	  "title": "Copy Title and URL",
	  "id": "btnCopyTitle",
	  "type" : "normal",
	  "contexts": ["all"],
	  "onclick": copyTitleAndUrlToClipboard
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
	  "onclick": copyAndCite
        }, function() {
            if (chrome.extension.lastError) {
                console.log("Got expected error: " + chrome.extension.lastError.message);
            }
        });

    chrome.contextMenus.create(
        {
	  "title": "Insert Fool Name",
	  "id": "btnInsertName",
	  "type" : "normal",
	  "contexts": ["editable"],
	  "onclick": insertName
        }, function() {
            if (chrome.extension.lastError) {
                console.log("Got expected error: " + chrome.extension.lastError.message);
            }
        });
});
