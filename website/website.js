import {CompLoader} from "../assets/comp/loader/comp-loader.js";
import {Config} from "../app/configs/config.js";
import {CompTabs} from "../assets/comp/tabs/comp-tabs.js";
import {ModuleChat} from "../modules/chat/module-chat.js";
import {CompNotification} from "../assets/comp/notification/comp-notification.js";

export class Website {

    static html;
    static header;
    static headerTag;
    static headerLoader;
    static pageContainer;
    static headerNotifications;
    static headerNotificationsButton;
    static headerClient;
    static headerButtonNotificationsChat;
    static headerButtonNotificationsNotification;
    static headerChat;
    static headerChatTopClose;
    static headerChatContent;
    static headerThemeButton;
    static headerOrientation;
    static headerLogout;
    static isWebLogged;
    static memoryOpenedChat = false;
    static clientIsInit = false;

    static init() {
        this.html = $(".webHtml");
        this.header = $(".header");
        this.headerTag = $("header");
        this.headerLoader = $(".headerLoader");
        this.headerNotifications = $(".headerNotifications");
        this.headerNotificationsButton = $(".headerRightIconNotification");
        this.headerHelp = $(".headerHelp");
        this.headerHelpButton = $(".headerRightIconHelp");
        this.headerClient = $(".headerClient");
        this.pageContainer = $(".webContainer");
        this.headerButtonNotificationsChat = $(".headerButtonNotificationsChat");
        this.headerButtonNotificationsNotification = $(".headerButtonNotificationsNotification");
        this.headerChat = $(".headerChat");
        this.headerChatTopClose = $(".headerChatTopClose");
        this.headerChatContent = $(".headerChatContent");
        this.headerThemeButton = $(".headerThemeButton");
        this.headerOrientation = $(".headerOrientation");
        this.headerLogout = $(".headerLogout");
        this.isWebLogged = $(".headerLogged").html().length > 0;
    }

    static initEvents() {
        this.routerInit();
        this.helpInit();
        this.notificationsInit();
        this.logoutInit();
        this.chatInit();
        this.themeInit();
        this.mobileInit();
        this.loaderHide();
        this.searchInit();
        if (!this.mobileActive())
            this.clientInit();
    }

    static routerInit() {
        $('body').on('click', 'a', (e) => {
            let a = $(e.currentTarget);
            let path = a.attr('href');
            e.preventDefault();


            let classesExcluded = ["webHtmlThread"];
            let classes = [];
            for (let parent = e.currentTarget.parentNode; parent; parent = parent.parentNode) {
                if (parent.className) {
                    classes.push(...parent.className.split(' '));
                }
            }

            if (path === '/register') {
                window.location.href = path;
                return false;
            }

            if (a.attr('target') === "_blank") {
                window.open(path);
            } else {
                if (classes.filter(value => classesExcluded.includes(value)).length === 0) {
                    this.routerExec(path);
                } else {
                    window.open(path);
                }
            }
            return false;
        });

        $('body').on('click', '.EmptyButtonLogin', (e) => {
            this.routerExec("/index");
            return false;
        });

        window.addEventListener('popstate', () => this.routerExec(document.location.pathname, true));


        if (window.location.pathname.startsWith("/hotel")) {
            this.routerExec(window.location.pathname);
        }

        if (window.location.pathname.startsWith("/center/citycash")) {
            this.routerDedipass("/center/citycash");
        }

        this.routerChats(window.location.pathname);
    }

    static routerExec(path, popState) {
        let modules = {
            "/organisations": () => CompTabs.createOrga(),
            "/center": () => CompTabs.createCenter(),
            "/prestige": () => CompTabs.createGamers(),
            "/chat": () => CompTabs.createChat(),
            "/calendar": () => CompTabs.createCalendar()
        };

        if (path.startsWith("/hotel")) {
            if (this.isWebLogged)
                this.clientShow();
            this.routerLoad(path, popState);
        } else {
            let module = modules[path];
            if (!popState && module && this.clientIsOpened()) {
                module();
            } else {
                if (path.startsWith("/profil")) {
                    CompTabs.createProfile(0, path.replace("/profil/", ""));
                } else {
                    if (this.clientIsOpened()) {
                        this.loaderShow();
                    }
                    this.clientHide();
                    this.routerLoad(path, popState);
                }
            }
        }
    }

    static routerChats(path) {
        let chats = this.mobileActive() ? [] : ["/home", "/settings", "/pics"];

        if (chats.includes(path)) {
            this.chatRoute();
        } else {
            this.chatUnFix();
            if (!this.memoryOpenedChat)
                this.chatClose();
        }
    }

    static routerDedipass(path) {
        if (path === "/center/citycash") {
            let custom, langselected, eventMethod;
            let elements = document.querySelectorAll(
                '[data-dedipass]:not([data-dedipass-auto-initialized])'
            );
            let length = elements.length;
            for (var idx = 0; idx < length; ++idx) {
                var element = elements[idx];
                if (element.id === '') {
                    element.id = 'dedipass-' + idx;
                }
                if (typeof element.dataset.dedipassCustom !== undefined) custom = element.dataset.dedipassCustom;
                if (typeof element.dataset.dedipassCountry !== undefined) langselected = element.dataset.dedipassCountry;
                element.innerHTML = '<iframe src="//api.dedipass.com/pay-2/#' + element.dataset.dedipass + '&' + custom + '&' + langselected + '" id="' + element.id + '-iframe' + '" style="width:100%;border:0 solid transparent;"></iframe>';

                eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                let eventer = window[eventMethod];
                let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

                eventer(messageEvent, function (e) {
                    if (e.data < 5000) {
                        let elem = document.getElementById(element.id + '-iframe');
                        if (elem !== null) {
                            elem.style.height = e.data + 'px';
                            eventMethod = null;
                            eventer = null;
                            messageEvent = null;
                        }
                    }
                }, false);
                if (element.dataset.dedipass === '') {
                    setTimeout(function () {
                        _autoInit();
                    }, 1000);
                } else {
                    element.setAttribute('data-dedipass-auto-initialized', 'initialized');
                }
            }
        }
    };

    static routerLoad(path, popState) {
        let loaderTimeout = setTimeout(() => this.loaderShow(), 80);

        $.ajax({
            type: "GET",
            url: path,
            success: (data) => {
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let title = doc.querySelector("title").text;

                document.title = title;
                if (!popState)
                    history.pushState(title, null, path);
                this.pageContainer.css({top: "100px", opacity: 0, transition: "0s"});
                this.pageContainer.html(doc.querySelector(".webContainer").innerHTML);
                this.pageContainer.animate({top: "0px", opacity: 1}, {duration: 100});

                clearTimeout(loaderTimeout);
                this.loaderHide();
                this.routerChats(path);
                this.routerDedipass(path);
                if (document.querySelector('.profilSearchWrite')) {
                    this.searchInit();
                }

                this.mobileOrientation();

                $('html, body').animate({scrollTop: 0}, 250);
            },
            error: () => {
                this.routerLoad("/404");
            }
        });
    }

    static loaderHide() {
        this.headerLoader.fadeOut();
    }

    static loaderShow() {
        this.headerLoader.show();
    }

    static notificationsInit() {
        let opened = false;
        this.headerNotificationsButton.click(() => {
            if (!opened) {
                this.headerHelp.hide();
                this.headerNotifications.show();
                CompLoader.render(this.headerNotifications);
                this.headerNotifications.load(`${Config.url}/modules/notifications/ModuleNotifications.php`);
                opened = true;
            } else {
                this.headerNotifications.hide();
                this.headerNotifications.html("");
                opened = false;
            }
        });

        $(document).on('click', (event) => {
            if (!this.headerNotifications.is(event.target) && !this.headerNotificationsButton.is(event.target) && this.headerNotifications.has(event.target).length === 0) {
                this.headerNotifications.hide();
                this.headerNotifications.html("");
                opened = false;
            }
        });

        setInterval(() => {
            $.ajax({
                type: "GET",
                url: `${Config.url}/modules/notifications/action/ActionNotificationsCount.php`,
                dataType: "json",
                success: (data) => {
                    if (data.count > 0) {
                        this.headerButtonNotificationsNotification.css({display: "flex"});
                        this.headerButtonNotificationsNotification.html(data.count);
                    } else {
                        this.headerButtonNotificationsNotification.hide();
                    }
                }
            });
        }, 10000);
    }

    static helpInit() {
        let opened = false;
        this.headerHelpButton.click(() => {
            if (!opened) {
                this.headerNotifications.hide();
                this.headerHelp.show();
                CompLoader.render(this.headerHelp);
                this.headerHelp.load(`${Config.url}/modules/help/ModuleHelp.php`);
                opened = true;
            } else {
                this.headerHelp.hide();
                this.headerHelp.html("");
                opened = false;
            }
        });

        $(document).on('click', (event) => {
            if (!this.headerHelp.is(event.target) && !this.headerHelpButton.is(event.target) && this.headerHelp.has(event.target).length === 0) {
                this.headerHelp.hide();
                this.headerHelp.html("");
                opened = false;
            }
        });
    }

    static logoutInit() {
        this.headerLogout.click(() => {
            fetch(`${Config.url}/website/index/action/ActionLogout.php`, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = "/index";
                    } else {
                        CompNotification.create("Erreur", data.response || "Déconnexion échouée, réessayez.", undefined, undefined, true);
                    }
                })
                .catch(error => {
                    CompNotification.create("Erreur", "Erreur lors de la déconnexion.", undefined, undefined, true);
                });
        });
    }

    static clientInit() {
        const urlParams = new URLSearchParams(window.location.search);
        if (!this.clientIsInit && !(urlParams.has('manage'))) {
            this.clientIsInit = true;
            window['ChatUpdateButtonNotification'] = (count) => {
                if (count === 0) {
                    this.headerButtonNotificationsChat.css({display: "none"});
                } else {
                    this.headerButtonNotificationsChat.css({display: "flex"});
                    this.headerButtonNotificationsChat.html(count);
                }
            }

            let play = $(".hotelForcePlay").html();
            let room = $(".hotelGoToRoom").html();
            this.headerClient.load(`${Config.url}/modules/client/ModuleClient.php${play ? `?play=play${room ? `&room=${room}` : ``}` : `${room ? `?room=${room}` : ``}`}`, () => {
                ModuleChat.reloadNotifications();
            });

            $('body').on('click', '.EmptyButtonHotel', (e) => {
                history.pushState("HabboCity - Hôtel", null, "/hotel/play");
                window.location.reload();
                return false;
            });
        }
    }

    static clientShow() {
        this.clientInit();

        this.headerClient.show();
        this.headerTag.addClass("headerOnClient");
        this.html.addClass("websiteOnClient");
        this.pageContainer.addClass("webContainerOnClient");
    }

    static clientHide() {
        this.headerClient.hide();
        this.html.removeClass("websiteOnClient");
        this.headerTag.removeClass("headerOnClient");
        this.pageContainer.removeClass("webContainerOnClient");
    }

    static clientIsOpened() {
        return this.headerTag.hasClass("headerOnClient");
    }

    static chatInit() {
        this.headerChatTopClose.click(() => {
            if (this.chatIsClosed()) {
                this.memoryOpenedChat = true;
                this.chatOpen();
            } else {
                this.memoryOpenedChat = false;
                this.chatClose();
            }
        });
    }

    static chatClose() {
        this.headerChat.animate({height: "50px"}, {duration: 250});
        setTimeout(() => {
            this.headerChat.addClass("headerChatClosed");
        }, 245);
    }

    static chatOpen() {
        this.headerChat.animate({height: window.innerHeight - 88}, {duration: 250});
        this.headerChat.removeClass("headerChatClosed");
        this.headerChat.show();
        setTimeout(() => {
            this.headerChat.css({height: "calc(100% - 88px)"});
        }, 250);

        if (!this.headerChatContent.hasClass("headerChatContentLoaded")) {
            CompLoader.render(this.headerChatContent);
            $.ajax({
                type: "GET",
                url: `${Config.url}/modules/chat/ModuleChat.php`,
                success: (data) => {
                    this.headerChatContent.append(data);
                    setTimeout(() => {
                        CompLoader.remove(this.headerChatContent);
                        this.headerChatContent.addClass("headerChatContentLoaded");
                    }, 150);
                }
            });
        }
    }

    static chatRoute() {
        this.chatFix();
        this.chatOpen();
    }

    static chatFix() {
        this.headerChat.addClass("headerChatFixed");
    }

    static chatUnFix() {
        this.headerChat.removeClass("headerChatFixed");
    }

    static chatIsClosed() {
        return this.headerChat.hasClass("headerChatClosed");
    }

    static themeInit() {
        this.headerThemeButton.click(() => this.themeToggle());
    }

    static themeToggle() {
        if (this.html.hasClass("white")) {
            this.html.removeClass("white");
            this.html.addClass("black");
            this.headerThemeButton.removeClass("headerRightIconMode");
            this.headerThemeButton.addClass("headerRightIconDarkMode");
            this.headerThemeButton.find('.headerButtonText').text('Mode Clair');
            this.themeUpdate(1);
        } else {
            this.html.removeClass("black");
            this.html.addClass("white");
            this.headerThemeButton.removeClass("headerRightIconDarkMode");
            this.headerThemeButton.addClass("headerRightIconMode");
            this.headerThemeButton.find('.headerButtonText').text('Mode Sombre');
            this.themeUpdate(0);
        }
    }

    static themeUpdate(theme) {
        $.ajax({
            type: "POST",
            data: {
                theme: theme
            },
            url: `${Config.url}/website/global/header/action/ActionHeaderTheme.php`,
            success: (data) => {
            }
        });
    }

    static mobileInit() {
        if (this.mobileActive()) {
            this.html.addClass("mobile");

            this.mobileOrientation();

            window.addEventListener('popstate', () => this.mobileOrientation());
            window.addEventListener('orientationchange', () => this.mobileOrientation());
        } else {
            this.html.removeClass("mobile");
        }
    }

    static mobileOrientation() {
        this.headerOrientation.css({display: "none"});
        this.headerOrientation.html("");
    }

    static mobileActive() {
        const maxMobileWidth = 900;
        if (window.innerWidth <= maxMobileWidth) {
            return true;
        }

        if (typeof window.orientation !== 'undefined') {
            return true;
        }

        return false;
    }

    static searchInit() {
        let searchBtn = document.querySelector('.profilSearchBubbleRight');
        let searchInput = document.querySelector('.profilSearchWrite');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                if (searchInput.value.replaceAll(' ', '') === '') return;
                this.routerExec(`/profil/${searchInput.value}`);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (searchInput.value.replaceAll(' ', '') === '') return;
                if (e.key === 'Enter') this.routerExec(`/profil/${searchInput.value}`);
            });
        }
    }
}

$(document).ready(() => {
    Website.init();

    if (!window['WebsiteInit']) {
        Website.initEvents();
        window['WebsiteInit'] = true;
    }

    window['websiteUpdateCurrencies'] = (cityCash, diamonds) => {
        $(".profilDataBoxBubbleDiamond").html(diamonds);
        $(".profilDataBoxBubbleCityCash").html(cityCash);
    }
});