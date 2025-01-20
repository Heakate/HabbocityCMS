import {ModuleClientQuickPoll} from "../../../modules/client/quickpoll/module-client-quickpoll.js";
import {CompNotification} from "../notification/comp-notification.js";
import {CompTabs} from "../tabs/comp-tabs.js";
import {ModuleClientClothing} from "../../../modules/client/clothing/module-client-clothing.js";
import {ModuleClientBuild} from "../../../modules/client/build/module-client-build.js";
import {ModuleChat} from "../../../modules/chat/module-chat.js";

export class CompHabblet {
    static ssoTicket = undefined;
    static ready = false;
    static protocol = "wss";
    static host = "habblet.habbocity.me";
    static port = "";
    static websocket = undefined;
    static messages = [];
    static habbletMessages = [];
    static pingInterval = undefined;

    static init(ssoTicket) {
        this.ssoTicket = ssoTicket;

        this.websocket = new WebSocket(this.protocol + "://" + this.host + ":" + this.port);
        this.websocket.onopen = () => {
            this.sendMessage({
                packetId: "ssoTicket",
                ticket: ssoTicket
            });
        };

        this.websocket.onmessage = (event) => {
            this.onMessage(event.data);
        };

        this.pingInterval = setInterval(() => {
            if (this.websocket.readyState === 3) {
                this.reconnect();
            } else {
                this.sendMessage({
                    packetId: "ping"
                });
            }
        }, 20000);

        this.registerAll();
    };

    static reconnect() {
        this.messages = [];
        this.habbletMessages = [];
        clearInterval(this.pingInterval);
        this.init(this.ssoTicket);
    }

    /**
     * messages
     */
    static sendMessage(objectMessage) {
        console.log(objectMessage)
        this.websocket.send(JSON.stringify(objectMessage));
    };

    static onMessage(message) {
        message = JSON.parse(message);
        console.log(message)
        if (this.messages.hasOwnProperty(message.packetId))
            this.messages[message.packetId](message);
    };

    /**
     * register
     */
    static registerAll() {
        this.registerMessage("habbletMessage", (message) => {
            let data = message.data;
            Object.keys(this.habbletMessages).forEach(key => {
                if (data.startsWith("/" + key)) {
                    let decodedData = this.decodeMessage(data);
                    this.habbletMessages[key](decodedData);
                }
            })
        });
        this.registerMessage("ssoTicket", (message) => this.ready = true);
        this.registerMessage("eventAlert", (message) => CompNotification.packetAlert(message));
        this.registerMessage("chatNewMessage", (message) => ModuleChat.packet(message));
        this.registerMessage("chatNewInvite", (message) => ModuleChat.packetInvite(message));
        this.registerMessage("displayProfilemes", (message) => CompTabs.createProfile(message.data));
        this.registerHabbletMessage("quickpoll", (message) => ModuleClientQuickPoll.packet(message));
        this.registerHabbletMessage("openMessenger", (message) => ModuleChat.packetOpen(message));
        this.registerHabbletMessage("mention", (message) => CompNotification.packet(message));
        this.registerHabbletMessage("robot", (message) => CompNotification.packet(message));
        this.registerHabbletMessage("clothing", (message) => ModuleClientClothing.packet(message));
        this.registerHabbletMessage("buildAction", (message) => ModuleClientBuild.packet(message));

        //this.registerHabbletMessage("roomsale", (message) => ModuleClientRoomSell.packet(message));
        //bienvenue
        //cityclub
        //calendar
    };

    static registerMessage(id, func) {
        this.messages[id] = func;
    };

    static registerHabbletMessage(id, func) {
        this.habbletMessages[id] = func;
    }

    /**
     * logic
     */
    static close() {
        this.websocket.close();
    };

    static decodeMessage(msg) {
        var params = {};
        new URLSearchParams(decodeURI(msg.replace(msg.split('?')[0], ''))).forEach((value, key) => {
            let newValue = value;
            newValue = newValue.replaceAll(';slash;', '/');
            newValue = newValue.replaceAll(';equal;', '=');
            params[key] = newValue;
        })
        return params;
    }

    static decodeString(string) {
        return string.replace(/;amp;/g, "&").replace(/;equal;/g, "=").replace(/;slash;/g, "/");
    }

    static nl2br(text) {
        if (typeof text === 'undefined' || text === null) {
            return '';
        }
        const regexList = [
            {regexp: new RegExp('\\r', 'igm'), replacement: ''},
            {regexp: new RegExp('\\n', 'igm'), replacement: '<br>'},
        ];
        return regexList.reduce((text, code) => text.replace(code.regexp, code.replacement), text);
    };

    /**
     * senders
     */
    static sendJoinRoom(roomId) {
        let msg = {
            packetId: "gotoroom",
            roomId: roomId
        }
        this.sendMessage(msg);
    }

    static sendFavoriteGroup(groupId) {
        let msg = {
            packetId: "groupFavourite",
            groupId: groupId
        }
        this.sendMessage(msg);
    }

    static sendJoinGroup(groupdId) {
        let msg = {
            packetId: "groupJoin",
            groupId: groupdId
        }
        this.sendMessage(msg);
    }

    static sendLeaveGroup(groupId) {
        let msg = {
            packetId: "groupLeave",
            groupId: groupId
        }
        this.sendMessage(msg);
    }

    static sendDeleteGroup(groupId) {
        let msg = {
            packetId: "groupDelete",
            groupId: groupId
        }
        this.sendMessage(msg);
    }

    static sendShowGroupMembers(groupId) {
        let msg = {
            packetId: "groupMembers",
            groupId: groupId
        }
        this.sendMessage(msg);
    }

    static sendRedeemClothing(itemId) {
        let msg = {
            packetId: "redeemclothing",
            itemId: itemId
        }
        this.sendMessage(msg);
    }
}