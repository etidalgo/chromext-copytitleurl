// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == "string", "tab.url should be a string");

        callback(tab);
    });
}

function renderStatus(statusText) {
    document.getElementById("status").textContent = statusText;
}

document.addEventListener("DOMContentLoaded", function() {
    getCurrentTabUrl(
        copyTitleAndUrlToClipboard,
        function(errorMessage) {
            renderStatus("Cannot display image. " + errorMessage);
        }
    );
});

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

function copyTitleAndUrlToClipboard(tab) {
    const titleAndUrl = getTitleAndUrl(tab);
    copyToClipboard(titleAndUrl);
}

function getTabTitleOrDefault(tab, defaultTitle) {
    const title = tab.title;
    if (title=="") {
        if (defaultTitle === undefined) {
            return defaultTitle;
        }
        return "Untitled";
    }
    return title;
}

function getTitleAndUrl(tab) {
    const title = getTabTitleOrDefault(tab);
    return title + " <" + tab.url + ">";
}

