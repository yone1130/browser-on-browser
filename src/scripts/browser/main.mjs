
export class Browser {
    name = "Browser";


    constructor(config) {
        console.debug(`${this.name}.constructor`);
        this.tabCount = 0;
        this.currentId = 0;
        this.homeUri = "view://newtab";

        this.elements = this.initElements(config.elements);
        this.initEvents();
        this.createTab(this.homeUri);
    }


    initElements(elements) {
        console.debug(`${this.name}.initElements`);

        let _elements = {};

        _elements.addressInput = document.getElementById(elements.addressInput);
        _elements.iframe = document.getElementById(elements.iframe);
        _elements.title = document.getElementById(elements.title);
        _elements.newTabButton = document.getElementById(elements.newTabButton);
        _elements.tabs = document.getElementById(elements.tabs);
        _elements.view = document.getElementById(elements.view);
        _elements.homeButton = document.getElementById(elements.homeButton);
        _elements.backButton = document.getElementById(elements.backButton);
        _elements.forwardButton = document.getElementById(elements.forwardButton);
        _elements.bookmarkYoneHomepage = document.getElementById(elements.bookmarkYoneHomepage);
        _elements.bookmarkYditsSite = document.getElementById(elements.bookmarkYditsSite);
        _elements.bookmarkYditsWeb = document.getElementById(elements.bookmarkYditsWeb);

        return _elements;
    }


    initEvents() {
        console.debug(`${this.name}.initEvents`);
        this.elements.addressInput.addEventListener("keydown", (event) => this.onKeydown(event));
        this.elements.newTabButton.addEventListener("click", (event) => this.onClickNewTabButton(event));
        this.elements.homeButton.addEventListener("click", (event) => this.onClickHomeButton(event));
        this.elements.backButton.addEventListener("click", (event) => this.onClickBackButton(event));
        this.elements.forwardButton.addEventListener("click", (event) => this.onClickForwardButton(event));
        this.elements.bookmarkYoneHomepage.addEventListener("click", (event) => this.onClickYoneHomepageBookmark(event));
        this.elements.bookmarkYditsSite.addEventListener("click", (event) => this.onClickYditsSiteBookmark(event));
        this.elements.bookmarkYditsWeb.addEventListener("click", (event) => this.onClickYditsWebBookmark());
    }


    onIframeContentLoaded(event, src) {
        console.debug(`${this.name}.onIframeContentLoaded: src: `, src);

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
                    this.onInvalidUrlEntered(error, src);
                    return;
                }
            }
        }

        this.elements.addressInput.value = url;
    }


    onKeydown(event) {
        console.debug(`${this.name}.onKeydown`);

        if (event.key === 'Enter') {
            this.onKeydownEnter(event);
        }
    }


    onKeydownEnter(event) {
        console.debug(`${this.name}.onKeydownEnter`);

        const uri = this.elements.addressInput.value;

        this.changeIframeSource(this.currentId, uri);
    }


    onClickNewTabButton(event) {
        this.createTab(this.homeUri);
    }


    onClickCloseTabButton(event, id) {
        this.closeTab(event, id)
    }


    onClickHomeButton(event) {
        this.changeIframeSource(this.currentId, this.homeUri);
    }


    onClickBackButton(event) {
        window.history.back();
    }


    onClickForwardButton(event) {
        window.history.forward();
    }


    onClickYoneHomepageBookmark(event) {
        this.changeIframeSource(this.currentId, "https://www.yoneyo.com/");
    }


    onClickYditsSiteBookmark(event) {
        this.changeIframeSource(this.currentId, "https://www.ydits.net/");
    }


    onClickYditsWebBookmark(event) {
        this.changeIframeSource(this.currentId, "https://webapp.ydits.net/");
    }


    createTab(uri) {
        if (this.elements.tabs.querySelectorAll("li").length >= 8) {
            alert("開けるタブ数は最大で8までです。")
            return;
        }

        this.tabCount += 1;
        const id = this.tabCount;

        this.currentId = id;

        const newTab = document.createElement('li');
        newTab.id = id;
        newTab.className = 'tabs__li';
        newTab.setAttribute('data-tab', id);
        newTab.innerHTML = `
            <div class="tabs__hover">
                <div class="tabs__left">
                    <img class="tabs__img" src="./images/public_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" srcset="">
                    <span class="tabs__title">Viewer</span>
                </div>
                <img id="close-${id}" class="tabs__close" src="./images/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" srcset="">
            </div>
        `;

        this.elements.tabs.appendChild(newTab);

        const newIframe = document.createElement('iframe');
        newIframe.id = `iframe-${id}`;
        newIframe.className = 'view__iframe';
        // newIframe.src = uri;

        this.elements.view.appendChild(newIframe);

        console.debug(id);
        console.debug(newTab);
        if (newTab) {
            newIframe.addEventListener("load", (event) => { this.onIframeContentLoaded(event, newIframe.contentWindow.location.href) })
            newTab.addEventListener("click", (event) => this.onClickTab(event, id));
            document.getElementById(`close-${id}`).addEventListener("click", (event) => this.onClickCloseTabButton(event, id));
        } else {
            console.error("New tab element not found in DOM.");
        }

        this.changeIframeSource(id, uri)

        this.onClickTab({}, id)
    }


    closeTab(event, id) {
        event.stopPropagation();

        const tabToRemove = document.getElementById(id);
        const iframeToRemove = document.getElementById(`iframe-${id}`);

        if (tabToRemove) {
            tabToRemove.remove();
        }

        if (iframeToRemove) {
            iframeToRemove.remove();
        }

        if (document.querySelector('.tabs__li.current') === null) {
            const firstTab = document.querySelector('.tabs__li');
            if (firstTab) {
                this.onClickTab({}, firstTab.getAttribute('data-tab'));
            } else {
                this.createTab(this.homeUri);
            }
        }
    }


    onClickTab(event, id) {
        console.debug(`${this.name}.onClickTab: id: `, id);

        this.currentId = id;

        const tab = document.getElementById(String(id));

        document.querySelectorAll('.tabs__li').forEach(t => t.classList.remove('current'));
        document.querySelectorAll('.view__iframe').forEach(t => t.classList.remove('active'));

        tab.classList.add('current');

        document.querySelectorAll('.view__iframe').forEach(content => content.classList.remove('active'));

        const activeTabContent = document.getElementById(`iframe-${tab.getAttribute('data-tab')}`);
        activeTabContent.classList.add('active');


        let url;
        const uri = activeTabContent.src;

        if (uri.startsWith("https://browser.yoneyo.com/")) {
            url = `${uri.replace(/^https:\/\/browser.yoneyo.com\/pages\//, '')}`;
            url = `view://${url.replace(".html", '')}`;
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

        this.elements.addressInput.value = url;
    }


    onInvalidUrlEntered(error, uri) {
        console.debug(`${this.name}.onInvalidUrlEntered`);
        console.error("Invalid url has entered: ", uri);
        alert("正しいURLを入力してください。");
    }


    changeIframeSource(id, uri) {
        console.debug(`${this.name}.changeIframeSource: uri: `, uri);

        let url;

        if (uri.startsWith("view://")) {
            url = `./pages/${uri.replace(/^view:\/\//, '')}.html`;
        } else {
            try {
                url = new URL(uri);
                uri = new URL(uri);
            } catch (error) {
                try {
                    url = new URL("https://" + uri);
                    uri = new URL("https://" + uri);
                } catch (error) {
                    this.onInvalidUrlEntered(error, uri);
                    return;
                }
            }
        }

        console.debug(uri, url)

        console.debug(`${this.name}.changeIframeSource`);
        const iframe = document.getElementById(`iframe-${id}`);
        this.elements.addressInput.value = uri;
        iframe.src = url;
    }
}
