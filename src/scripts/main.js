/**!
 * 
 * Browser on Browser
 * 
 * Copyright (C) 2024 よね/Yone
 * 
 * Licensed under the MIT License.
 * 
 */

import { Browser } from "./browser/browser.js";

/**
 * @type {Browser}
 */
const browser = new Browser({
    elements: {
        addressInput: document.getElementById("addressBarInput"),
        title: document.getElementById("tabTitle"),
        newTabButton: document.getElementById("newTabButton"),
        tabs: document.getElementById("tabsUl"),
        view: document.getElementById("view"),
        homeButton: document.getElementById("homeButton"),
        backButton: document.getElementById("backButton"),
        forwardButton: document.getElementById("forwardButton"),
        bookmarkYoneHomepage: document.getElementById("bookmarkYoneHomepage"),
        bookmarkYditsSite: document.getElementById("bookmarkYditsSite"),
        bookmarkYditsWeb: document.getElementById("bookmarkYditsWeb"),
    },
});

await browser.run();
