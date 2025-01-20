import {CompRoutabs} from "../../assets/comp/routabs/comp-routabs.js";
import {CompPlayersResearch} from "../../assets/comp/players/research/comp-players-research.js";
import {ModuleClientStatic} from "../client/module-client-static.js";
import {CompHabblet} from "../../assets/comp/habblet/comp-habblet.js";
import {CompTabs} from "../../assets/comp/tabs/comp-tabs.js";
import {Config} from "../../app/configs/config.js";
import {CompNotification} from "../../assets/comp/notification/comp-notification.js";

export class ModuleChat {
    router = null;
    module = null;
    moduleMessages = null;
    input = null;
    searchBox = null;
    invitationBox = null;
    conversationsBox = null;
    entries = [];
    website = false;
    chatRight = null;

    static localInviteName = "chatInvite";

    constructor() {
        this.router = null;
        this.module = $(".moduleChat").last();
        this.moduleMessages = null;
        this.input = this.module.find(".moduleChatSearchBar");
        this.searchBox = this.module.find(".moduleChatMessageBoxSearch");
        this.invitationBox = this.module.find(".moduleChatMessageBoxInvites");
        this.conversationsBox = this.module.find(".moduleChatMessagesBox");
        this.chatRight = this.module.find(".moduleChatRight");
        this.entries = [];
        this.localInviteName = "chatInvite";

        window['ModuleChatOpened'] = (module) => {
            if (window['packedOpenPlayerId']) {
                module.openConversation(window['packedOpenPlayerId']);
                window['packedOpenPlayerId'] = undefined;
            } else if (window['lastOpenedConversationId']) {
                module.reloadConversation(parseInt(window['lastOpenedConversationId']), true);
            }
        };

        this.initMode();
        this.initRoutes();
        this.initPlayersSearch();
        this.initButtons();

        window['ModuleChat'] = this;
    }

    initMode() {
        if (this.module.width() <= 400) {
            this.module.addClass("moduleChatWebsite");
            this.website = true;
        }
    }

    initRoutes() {
        this.router = new CompRoutabs(this.module, this.module.find('.moduleChatRight'), []);
        this.module[0].querySelectorAll('.moduleChatMessagesList').forEach((el) => {
            this.initConversation($(el), el.getAttribute("data-id"));
        });

        if (window['ModuleChatOpened'])
            window['ModuleChatOpened'](this);
    }

    initConversationRightClose() {
        this.chatRight.addClass("moduleChatRightOpened");
        let closeButton = $(`<div class="moduleChatRightOpenedClose"><div class="icon"></div> </div>`);
        this.chatRight.append(closeButton);
        closeButton.click(() => {
            this.chatRight.removeClass("moduleChatRightOpened");
        });
    }

    initConversation(jqueryEl, conversationId) {
        jqueryEl.find(".moduleChatMessagesHide").last().click((event) => {
            event.preventDefault();
            event.stopPropagation();
            this.hideConversation(jqueryEl, conversationId);
        });

        jqueryEl.click(() => {
            window['lastOpenedConversationId'] = conversationId;
        });

        if (this.website) {
            jqueryEl.click(() => {
                this.router.onTabRender = () => {
                    this.initConversationRightClose();
                }
                this.initConversationRightClose();
            });
        }

        this.initConversationRoute(conversationId);
    }

    hideConversationId(conversationId) {
        let jqueryEl = this.router.routes.find(value => value.selector.hasClass("moduleChatMessagesList-" + conversationId));
        if (jqueryEl) {
            this.hideConversation(jqueryEl.selector, conversationId)
        }
    }

    hideConversation(jqueryEl, conversationId) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/modules/chat/messages/action/ModuleChatHideConversation.php`,
            data: {
                conversationId: conversationId
            },
            dataType: "json",
            success: (json) => {
                if (!json['error']) {
                    if (parseInt(window['lastOpenedConversationId']) === parseInt(conversationId)) {
                        window['lastOpenedConversationId'] = undefined;
                    }

                    jqueryEl.remove();
                    this.router.removeRoute({
                        module: `${Config.url}/modules/chat/messages/ModuleChatMessages.php?conversationId=` + conversationId
                    });

                    ModuleChat.reloadNotifications();
                }
            }
        });
    }

    initConversationRoute(conversationId) {
        let entry = {
            selector: ".moduleChatMessagesList-" + conversationId,
            module: `${Config.url}/modules/chat/messages/ModuleChatMessages.php?conversationId=` + conversationId
        };

        if (!this.router.routes.find(value => value.module === entry.module)) {
            let route = this.router.addRoute(entry);
            this.entries.push({conversationId: conversationId, route: route});

            return route;
        }
    }

    initButtons() {
        let msgButton = this.module.find(".moduleChatButtonMessagesMsg");
        let reqButton = this.module.find(".moduleChatButtonMessagesReq");
        let inviteButton = this.module.find(".moduleChatButtonMessagesInvite");

        let chatBox = this.module.find(".moduleChatMessagesBox");

        let onClickButton = (button) => {
            reqButton.removeClass("moduleChatButtonMessagesSelected");
            msgButton.removeClass("moduleChatButtonMessagesSelected");
            inviteButton.removeClass("moduleChatButtonMessagesSelected");

            button.addClass("moduleChatButtonMessagesSelected");

            this.invitationBox.hide();
            this.searchBox.hide();
        }

        msgButton.click(() => {
            onClickButton(msgButton);
            chatBox.addClass("moduleChatMessagesBoxMsg");
            chatBox.removeClass("moduleChatMessagesBoxReq");
        });

        reqButton.click(() => {
            onClickButton(reqButton);
            chatBox.removeClass("moduleChatMessagesBoxMsg");
            chatBox.addClass("moduleChatMessagesBoxReq");
        });

        inviteButton.click(() => {
            onClickButton(inviteButton);

            this.invitationBox.show();
            let invites = ModuleChat.getLocalInvites();

            if (invites.length > 0) {
                this.invitationBox.html("");
            }

            invites.forEach(value => {
                this.prependInvite(this.invitationBox, value);
            });
        });

        this.reloadInviteCount();
    }

    initPlayersSearch() {
        let playersSearch = new CompPlayersResearch(this.searchBox, this.input);
        playersSearch.onPlayerClick = (id) => {
            this.openConversation(id, () => playersSearch.container.hide());
        }
    }

    openConversation(playerId, callback) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/modules/chat/messages/action/ModuleChatCreateConversation.php`,
            data: {
                playerId: playerId
            },
            dataType: "json",
            success: (json) => {
                if (callback)
                    callback();

                if (!json.error) {
                    window['lastOpenedConversationId'] = json.response;
                    this.reloadConversation(json.response, true);
                } else {
                    CompNotification.create("Billy", "Tu ne peux pas envoyer ce message à cette personne", undefined, undefined, true);
                }
            }
        });
    }

    async renderConversation(id, html) {
        return new Promise((resolve, reject) => {
            let onTemplate = (template) => {
                let elem = $(template);
                this.conversationsBox.prepend(elem);
                this.initConversation(elem, id);
            }

            if (html) {
                onTemplate(html);
                resolve();
            } else {
                this.templateConversation(id)
                    .then(template => {
                        onTemplate(template);
                        resolve();
                    });
            }
        });
    }

    async templateConversation(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `${Config.url}/modules/chat/messages/action/ModuleChatTemplateConversation.php`,
                data: {
                    conversationId: id
                },
                dataType: "json",
                success: (json) => {
                    if (json['template'] != null) {
                        resolve(json['template']);
                    } else {
                        this.hideConversationId(id);
                        reject();
                    }
                }
            });
        });
    }

    async reloadConversation(id, reShow) {
        return new Promise((resolve, reject) => {
            this.templateConversation(id)
                .then(template => {
                    let element = $(".moduleChatMessagesList-" + id);
                    let time = element.attr('data-time');
                    let newElement = $(template);
                    let newTime = newElement.attr('data-time');

                    if (!element[0]) {
                        this.renderConversation(id, template)
                            .then(() => resolve());
                    } else {
                        if (parseInt(newTime) > parseInt(time)) {
                            let eElement = element[0].parentNode;
                            if (eElement.firstChild !== element[0]) {
                                eElement.insertBefore(element[0], eElement.firstChild);
                            }
                        }

                        element.attr('data-time', newTime);
                        element.html(newElement.html());

                        if (newElement.hasClass("moduleChatMessagesListNewMessages")) {
                            element.addClass("moduleChatMessagesListNewMessages");
                        } else {
                            element.removeClass("moduleChatMessagesListNewMessages");
                        }

                        this.initConversation(element, id);
                        resolve();
                    }

                    if (reShow) {
                        let route = this.entries.find(value => parseInt(value.conversationId) === id);
                        if (!route) {
                            route = this.initConversationRoute(id);
                        }

                        this.router.renderTab(route.route);

                        this.initConversationRightClose();
                    }
                });
        });
    }

    async readMessages(conversationId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `${Config.url}/modules/chat/messages/action/ModuleChatReadMessage.php`,
                data: {
                    conversationId: conversationId
                },
                dataType: "json",
                success: (json) => {
                    resolve();
                }
            });
        });
    }

    reloadInviteCount() {
        let inviteCountBox = $(".moduleChatInviteCount").last();
        if (inviteCountBox[0]) {
            let invites = ModuleChat.getLocalInvites().length;
            if (invites > 0) {
                inviteCountBox.show();
                inviteCountBox.html(ModuleChat.getLocalInvites().length);
            } else {
                inviteCountBox.hide();
            }
        }
    }

    prependInvite(box, inviteTemplate) {
        let invite = $(inviteTemplate);
        box.prepend(invite);
        let joinButton = invite.find(".moduleChatInviteJoin");
        joinButton.click(() => {
            CompHabblet.sendJoinRoom(parseInt(joinButton.attr("data-room")));
        });

        let deleteButton = invite.find(".moduleChatInviteDelete");
        deleteButton.click(() => {
            let invites = ModuleChat.getLocalInvites();
            invites.splice(invites.indexOf(inviteTemplate), 1);
            window.localStorage.setItem(this.localInviteName, JSON.stringify({invites: invites}));
            this.reloadInviteCount();

            ModuleChat.reloadNotifications();
            invite.remove();
        });
    }

    hideChatRight() {
        this.chatRight.removeClass("moduleChatRightOpened");
    }

    /**
     * static
     */
    static getLocalInvites() {
        return window.localStorage.getItem(this.localInviteName) != null ? JSON.parse(window.localStorage.getItem(this.localInviteName))['invites'] : [];
    }

    static templateInvite(senderId, message, roomId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `${Config.url}/modules/chat/messages/action/ModuleChatTemplateInvite.php`,
                data: {
                    senderId: senderId,
                    message: message,
                    roomId: roomId
                },
                dataType: "json",
                success: (json) => {
                    if (json['template'] != null) {
                        resolve(json['template']);
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    static reloadNotifications() {
        $.ajax({
            type: "POST",
            url: `${Config.url}/modules/chat/messages/action/ModuleChatReloadNotifications.php`,
            dataType: "json",
            success: (json) => {
                if (json['template'] != null) {
                    if (window['ChatUpdateButtonNotification']) {
                        window['ChatUpdateButtonNotification'](parseInt(json['template']) + ModuleChat.getLocalInvites().length);
                    }

                    ModuleClientStatic.updateButtonNotification("Chat", parseInt(json['template']) + ModuleChat.getLocalInvites().length);
                }
            }
        });
    }

    static getModule() {
        if (window['ModuleChat']) {
            if (!document.body.contains(window['ModuleChat'].module[0])) {
                return undefined;
            }
        }

        return window['ModuleChat'];
    }

    static packet(message) {
        let module = this.getModule();
        if (module) {
            let data = JSON.parse(message.data);
            let read = false;

            window['lastConversation'] = data.conversationId;

            if (module.module && module.moduleMessages) {
                read = module.moduleMessages.packet(data.conversationId, data.messageId);
            }

            if (!read) {
                ModuleChat.reloadNotifications();
                if (module.module)
                    module.reloadConversation(data.conversationId);
            } else {
                module.readMessages(data.conversationId)
                    .then(() => module.reloadConversation(data.conversationId));
            }
        } else {
            ModuleChat.reloadNotifications();
        }
    }

    static packetInvite(message) {
        let data = JSON.parse(message.data);

        this.templateInvite(data.senderId, data.message, data.roomId)
            .then(data => {
                let invites = this.getLocalInvites();
                invites.push(data);
                window.localStorage.setItem(this.localInviteName, JSON.stringify({invites: invites}));

                let module = this.getModule();
                if (module) {
                    let invitationBox = $(".moduleChatMessageBoxInvites").last();
                    if (invitationBox[0]) {
                        module.prependInvite(invitationBox, data);
                    }
                    module.reloadInviteCount();
                }

                ModuleChat.reloadNotifications();
            });
    }

    static packetOpen(message) {
        let module = this.getModule();

        if (message.id === "0") {
            if (!module) {
                CompTabs.createChat();
            }
        } else {
            if (!module) {
                if (message.id !== "0")
                    window['packedOpenPlayerId'] = message.id;

                CompTabs.createChat();
            } else {
                module.openConversation(message.id);
            }
        }
    }
}