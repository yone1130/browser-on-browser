/**!
 *
 * Browser on Browser
 *
 * Copyright (C) 2024 よね/Yone
 * Licensed under the MIT License.
 * 
 * https://github.com/yone1130/browser-on-browser
 *
 */

export class Browser {
    /**
     * @param {{
     *     elements: {},
     * }} config
     */
    constructor(config) {
        console.debug(`${this.name}.constructor`);
        this.#config = config;
        this.#elements = config.elements;
    }

    /**
     * @type {string}
     */
    name = "Browser";

    /**
     * @returns {Promise<void>}
     */
    async run() {
        console.debug(`${this.name}.run`);
        this.#initializeEvents();
        this.#createTab(this.#homeUri);
    }

    /**
     * @type {Object}
     */
    #config = {};

    /**
     * @type {number}
     */
    #tabCount = 0;

    /**
     * @type {number}
     */
    #currentId = 0;

    /**
     * @type {string}
     */
    #homeUri = "view://newtab";

    /**
     * @type {Object}
     */
    #elements = {};

    /**
     * @returns {void}
     */
    #initializeEvents() {
        console.debug(`${this.name}.#initializeEvents`);

        this.#elements.addressInput.addEventListener("keydown", (event) =>
            this.#onKeydown(event)
        );
        this.#elements.newTabButton.addEventListener("click", (event) =>
            this.#onClickNewTabButton(event)
        );
        this.#elements.homeButton.addEventListener("click", (event) =>
            this.#onClickHomeButton(event)
        );
        this.#elements.backButton.addEventListener("click", (event) =>
            this.#onClickBackButton(event)
        );
        this.#elements.forwardButton.addEventListener("click", (event) =>
            this.#onClickForwardButton(event)
        );
        this.#elements.bookmarkYoneHomepage.addEventListener("click", (event) =>
            this.#onClickYoneHomepageBookmark(event)
        );
        this.#elements.bookmarkYditsSite.addEventListener("click", (event) =>
            this.#onClickYditsSiteBookmark(event)
        );
        this.#elements.bookmarkYditsWeb.addEventListener("click", (event) =>
            this.#onClickYditsWebBookmark()
        );
    }

    /**
     * @param {Event} event
     * @param {string} src
     * @returns {void}
     */
    #onIframeContentLoaded(event, src) {
        console.debug(`${this.name}.#onIframeContentLoaded: src: `, src);

        let url;

        if (src.startsWith("https://browser.yoneyo.com")) {
            return;
        } else {
            try {
                url = new URL(src);
            } catch (error) {
                try {
                    url = new URL("https://" + src);
                } catch (error) {
                    this.#onInvalidUrlEntered(error, src);
                    return;
                }
            }
        }

        this.#elements.addressInput.value = url;

        console.debug(`----------------------------------------------------------------`);
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    #onKeydown(event) {
        console.debug(`${this.name}.#onKeydown`);

        if (event.key === "Enter") {
            this.#onKeydownEnter(event);
        }
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    #onKeydownEnter(event) {
        console.debug(`${this.name}.#onKeydownEnter`);

        const uri = this.#elements.addressInput.value;

        this.#changeIframeSource(this.#currentId, uri);
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickNewTabButton(event) {
        console.debug(`${this.name}.#onClickNewTabButton`);
        this.#createTab(this.#homeUri);
    }

    /**
     * @param {MouseEvent} event
     * @param {number} id
     * @returns {void}
     */
    #onClickCloseTabButton(event, id) {
        console.debug(`${this.name}.#onClickCloseTabButton`);
        this.#closeTab(event, id);
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickHomeButton(event) {
        console.debug(`${this.name}.#onClickHomeButton`);
        this.#changeIframeSource(this.#currentId, this.#homeUri);
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickBackButton(event) {
        console.debug(`${this.name}.#onClickBackButton`);
        window.history.back();
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickForwardButton(event) {
        console.debug(`${this.name}.#onClickForwardButton`);
        window.history.forward();
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickYoneHomepageBookmark(event) {
        console.debug(`${this.name}.#onClickYoneHomepageBookmark`);
        this.#changeIframeSource(this.#currentId, "https://www.yoneyo.com/");
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickYditsSiteBookmark(event) {
        console.debug(`${this.name}.#onClickYditsSiteBookmark`);
        this.#changeIframeSource(this.#currentId, "https://www.ydits.net/");
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #onClickYditsWebBookmark(event) {
        console.debug(`${this.name}.#onClickYditsWebBookmark`);
        this.#changeIframeSource(this.#currentId, "https://webapp.ydits.net/");
    }

    /**
     * @param {string} uri
     * @returns {void}
     */
    #createTab(uri) {
        console.debug(`${this.name}.#createTab`);

        this.#tabCount += 1;
        const id = this.#tabCount;

        this.#currentId = id;

        const newTab = document.createElement("li");
        newTab.id = id;
        newTab.className = "tabs__li";
        newTab.setAttribute("data-tab", id);
        newTab.innerHTML = `
            <div class="tabs__hover">
                <div class="tabs__left">
                    <img class="tabs__img" src="./images/public_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="Viewer ${id}" aria-hidden srcset="">
                    <span class="tabs__title">Viewer ${id}</span>
                </div>
                <img id="close-${id}" class="tabs__close" src="./images/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="Close this tab" srcset="">
            </div>
        `;

        this.#elements.tabs.appendChild(newTab);

        const newIframe = document.createElement("iframe");
        newIframe.id = `iframe-${id}`;
        newIframe.className = "view__iframe";
        // newIframe.src = uri;

        this.#elements.view.appendChild(newIframe);

        console.debug(`${this.name}.#createTab: Creating tab: id: `, id);
        console.debug(`${this.name}.#createTab: newTab: `, newTab);

        if (newTab) {
            newIframe.addEventListener("load", (event) => {
                this.#onIframeContentLoaded(
                    event,
                    newIframe.contentWindow.location.href
                );
            });
            newTab.addEventListener("click", (event) =>
                this.#onClickTab(event, id)
            );
            newTab.addEventListener('auxclick', (event) => {
                // if middle click
                if (event.button === 1) {
                    console.debug(`${this.name}.#createTab: Middle click detected`);
                    this.#closeTab(event, id)
                }
            });
            document
                .getElementById(`close-${id}`)
                .addEventListener("click", (event) =>
                    this.#onClickCloseTabButton(event, id)
                );
        } else {
            console.error("New tab element not found in DOM.");
        }

        this.#changeIframeSource(id, uri);

        this.#onClickTab({}, id);
    }

    /**
     * @param {Event} event
     * @param {number} id
     * @returns {void}
     */
    #closeTab(event, id) {
        console.debug(`${this.name}.#closeTab: id: `, id);

        event.stopPropagation();

        const tabToRemove = document.getElementById(id);
        const iframeToRemove = document.getElementById(`iframe-${id}`);

        if (tabToRemove) {
            tabToRemove.remove();
        }

        if (iframeToRemove) {
            iframeToRemove.remove();
        }

        if (document.querySelector(".tabs__li.current") === null) {
            const firstTab = document.querySelector(".tabs__li");
            if (firstTab) {
                this.#onClickTab({}, firstTab.getAttribute("data-tab"));
            } else {
                this.#createTab(this.#homeUri);
            }
        }

        console.debug(`----------------------------------------------------------------`);
    }

    /**
     * @param {Event} event
     * @param {number} id
     * @returns {void}
     */
    #onClickTab(event, id) {
        console.debug(`${this.name}.#onClickTab: id: `, id);

        this.#currentId = id;

        const tab = document.getElementById(String(id));

        document
            .querySelectorAll(".tabs__li")
            .forEach((t) => t.classList.remove("current"));
        document
            .querySelectorAll(".view__iframe")
            .forEach((t) => t.classList.remove("active"));

        tab.classList.add("current");

        document
            .querySelectorAll(".view__iframe")
            .forEach((content) => content.classList.remove("active"));

        const activeTabContent = document.getElementById(
            `iframe-${tab.getAttribute("data-tab")}`
        );
        activeTabContent.classList.add("active");

        let url;
        const uri = activeTabContent.src;

        if (uri.startsWith("https://browser.yoneyo.com/")) {
            url = `${uri.replace(
                /^https:\/\/browser.yoneyo.com\/pages\//,
                ""
            )}`;
            url = `view://${url.replace(".html", "")}`;
        } else {
            try {
                url = new URL(uri);
            } catch (error) {
                try {
                    url = new URL("https://" + uri);
                } catch (error) {
                    return;
                }
            }
        }

        this.#elements.addressInput.value = url;

        console.debug(`----------------------------------------------------------------`);
    }

    /**
     * @param {Error} error
     * @param {string} uri
     * @returns {void}
     */
    #onInvalidUrlEntered(error, uri) {
        console.debug(`${this.name}.#onInvalidUrlEntered`);
        console.error("Invalid url has entered: ", uri);
        alert("正しいURLを入力してください。");
    }

    /**
     * @param {number} id
     * @param {string} uri
     * @returns {void}
     */
    #changeIframeSource(id, uri) {
        console.debug(`${this.name}.#changeIframeSource: uri: `, uri);

        let url;

        if (uri.startsWith("view://")) {
            url = `./pages/${uri.replace(/^view:\/\//, "")}.html`;
        } else {
            try {
                url = new URL(uri);
                uri = new URL(uri);

                if (uri.protocol === "javascript:") {
                    this.#onInvalidUrlEntered(undefined, uri);
                    return;
                }
            } catch (error) {
                try {
                    url = new URL("https://" + uri);
                    uri = new URL("https://" + uri);
                } catch (error) {
                    this.#onInvalidUrlEntered(error, uri);
                    return;
                }
            }
        }

        console.debug(`${this.name}.#changeIframeSource: Entered uri: `, uri);
        console.debug(`${this.name}.#changeIframeSource: Changed url: `, url);

        console.debug(`${this.name}.changeIframeSource`);
        const iframe = document.getElementById(`iframe-${id}`);
        this.#elements.addressInput.value = uri;
        iframe.src = url;
    }
}
