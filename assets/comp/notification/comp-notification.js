import {CompButtons} from "../buttons/comp-buttons.js";
import {CompHabblet} from "../habblet/comp-habblet.js";
import {CompTabs} from "../tabs/comp-tabs.js";

export class CompNotification {
    static root = undefined;

    static init() {
        CompNotification.root = $(`<div class="CompNotification"><div class="closeAll">Fermer tout</div></div>`);
        $("body").append(CompNotification.root);
        this.getRoot().find('.closeAll').click(() => {
            document.querySelectorAll('.notification').forEach((el) => {
                this.animateClose($(el));
            });
            this.getRoot().find('.closeAll').css('display', 'none');
        });

        window['CompNotification'] = this;
    }

    static packet(data) {
        this.create(data.username, data.message, true, data.room, false, true);
    }

    static packetAlert(data) {
        this.createAnimation(data.username, data.figure, data.title, CompHabblet.nl2br(CompHabblet.decodeString(data.description)), data.header, data.button_text, data.type, CompHabblet.decodeString(data.button_event));
    }

    static create(username, text, canReply, roomId, isError, isUser) {
        //language=HTML
        let notification = $(`
            <div class="notification">
                <div class="ntf1">
                    <div class="ntf2"></div>
                    <div class="ntf3">De <u class="ntf3OpenProfile">${username}</u></div>
                    <div class="ntf3Close"></div>
                </div>
                <div class="ntf4">
                    ${this.escapeHtml(text)}
                </div>
                <div class="ntf4Buttons"></div>
            </div>
        `)

        this.getRoot().prepend(notification);

        if (roomId && roomId !== 0) {
            let roomButton = $(`
                <div class="ntf5">
                    <div class="ntf8"></div>
                </div>
            `);
            notification.find(".ntf4Buttons").append(roomButton);
            roomButton.click(() => CompHabblet.sendJoinRoom(roomId));
        }

        if (canReply) {
            let replyContainer = $(`
                <div class="ntf9">
                    <div class="ntf10"></div>
                    <div class="ntf11">Répondre</div>
                </div>`);
            notification.find(".ntf4Buttons").append(replyContainer);

            replyContainer.click(() => {
                let replyContainer = $(`
                    <div class="ntf12">
                        <textarea maxlength="100" placeholder="Mon message..." class="ntf13"></textarea>
                        <div class="ntf4Buttons">
                            <div class="ntf5 send">Envoyer</div>
                            <div class="ntf5 cancel">Annuler</div>
                        </div>
                    </div>
                `);

                notification.append(replyContainer);
                replyContainer.find(".cancel").click(() => {
                    replyContainer.remove();
                });
                replyContainer.find(".send").click(() => {
                    CompHabblet.sendMessage({
                        packetId: "mentionWrite",
                        username: username,
                        text: replyContainer.find(".ntf13").val()
                    });

                    replyContainer.remove();
                });
            });
        }

        if (isUser) {
            notification.find('.ntf3OpenProfile').click(() => {
                CompTabs.createProfile(0, username);
            });
        }

        this.animate(notification);

        this.getRoot().find('.closeAll').css('display', 'flex');
    }

    static createAnimation(username, figure, title, description, header, buttonText, type, buttonEvent) {
        const imageType = type ? type : "guides";

        let notification = $(`
        <div class="notification animation">
            <div class="ntf1">
                <div class="ntf2"></div>
                <div class="ntf3">${title}</div>
                <div class="ntf3Close"></div>
            </div>
            <div class="compNotificationContainer" style="display: flex">
                <div class="image">
                    <img src="https://www.habbocity.me/swfs/c_images/notifications/${imageType}.png"/>
                </div>
                <div class="content">
                    <div>
                        ${description}
                    </div>
                    <div class="author">
                        <img class="authorFigure"
                             src="https://avatar.habbocity.me/?figure=${figure}&headonly=1&head_direction=2"/>
                        <div class="authorUsername">
                            Par ${username}
                        </div>
                    </div>
                </div>
            </div>
            <div class="buttons"></div>
        </div>
    `);
        this.getRoot().prepend(notification);
        CompButtons.create(notification.find(".buttons"),
            buttonText, () => {
                if (buttonEvent.includes("event:navigator/goto/")) {
                    CompHabblet.sendJoinRoom(parseInt(buttonEvent.replaceAll("event:navigator/goto/", "")));
                }
                this.animateClose(notification);
            }, "Fermer", () => {

            });

        this.animate(notification);
    }

    static animate(notification) {
        notification.animate({left: "20px"}, 300);
        let height = notification[0].getBoundingClientRect().height + 15;
        notification["animateHeight"] = height;
        $(".notification").each((index) => {
            let element = $(".notification")[index];
            let jqueryElement = $(element);
            if (element !== notification[0]) {
                jqueryElement.animate({top: jqueryElement.position().top + height + "px"}, 250);
            }
        });

        notification.find(".ntf3Close").click(() => this.animateClose(notification));
    }

    static animateClose(notification) {
        const notifications = $(".notification");
        let notificationTop = notification.position().top;
        notification.remove();
        notifications.each((index) => {
            let jqueryElement = $(notifications[index]);
            let jqueryElementTop = jqueryElement.position().top;
            if (notificationTop < jqueryElementTop) {
                jqueryElement.animate({top: jqueryElementTop - notification["animateHeight"] + "px"}, 250);
            }
        });
        if (notifications.length === 1) {
            this.getRoot().find('.closeAll').css('display', 'none');
        }
    }

    static getRoot() {
        if (CompNotification.root === undefined) {
            CompNotification.init();
        }
        return this.root;
    }

    static escapeHtml(text) {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }
}