import { Browser } from "./browser/main.mjs";

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        new Browser({
            elements: {
                addressInput: "addressBarInput",
                title: "tabTitle",
                newTabButton: "newTabButton",
                tabs: "tabsUl",
                view: "view",
                homeButton: "homeButton",
                backButton: "backButton",
                forwardButton: "forwardButton",
                bookmarkYoneHomepage: "bookmarkYoneHomepage",
                bookmarkYditsSite: "bookmarkYditsSite",
                bookmarkYditsWeb: "bookmarkYditsWeb",
            },
        });
    });
})();
