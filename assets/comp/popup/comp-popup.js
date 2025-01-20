import {CompLoader} from "../loader/comp-loader.js";
import {Config} from "../../../app/configs/config.js";

export class CompPopup {
    static root = undefined;
    static index = 2;
    static popups = {};
    static popupsIds = {};

    static init() {
        CompPopup.root = $(`<div class="CompPopup"></div>`);
        $("body").append(CompPopup.root);
    }

    static reload(url) {
        let popup = this.popups[url];
        this.createLoadContent(popup, url);
    }

    static create(url, icon, title, height, width, id) {
        if (this.popups[url] !== undefined) {
            return;
        }

        if (CompPopup.root === undefined) {
            CompPopup.init();
        }

        //language=HTML
        let popup = $(`
            <div class="background ${id ? `popup-${id}` : ``}">
                <div style="height: ${height === 'auto' ? 'auto' : height + 'px'};width: ${width}px;"
                     class="popup">
                    <div class="popupHead">
                        <div class="popupHeadIcon">
                            <img src="../../../assets/img/${icon}.png"/>
                        </div>
                        <div class="popupHeadTitle">
                            ${title}
                        </div>
                        <div class="popupHeadClose popupCloseButton"></div>
                    </div>
                    <div class="popupContent"></div>
                </div>
            </div>`);
        CompPopup.root.append(popup);
        popup.css("z-index", CompPopup.index++);
        popup.click(() => popup.css("z-index", CompPopup.index++));
        setTimeout(() => popup.find(".popup").css({transform: 'scale(1)', opacity: 1}), 0);
        popup.find(".popupCloseButton").click(() => {
            this.remove(popup);
        });

        popup['popupUrl'] = url;
        this.popups[url] = popup;
        if (id) {
            popup['popupId'] = id;
            this.popupsIds[id] = popup;
        }
        this.createLoadContent(popup, url);

        return popup;
    }

    static remove(popup) {
        if (popup) {
            delete this.popups[popup['popupUrl']];

            if (popup['popupId'])
                delete this.popups[popup['popupId']];
            popup.remove();
        }
    }

    static removeId(id) {
        this.remove(this.popupsIds[id]);
    }

    static createLoadContent(popup, url) {
        let contentContainer = popup.find(".popupContent");
        contentContainer.html("");
        CompLoader.render(contentContainer);
        $.ajax({
            type: "GET",
            url: url,
            success: (data) => {
                contentContainer.append(data);

                if (popup.onload) {
                    popup.onload();
                }

                setTimeout(() => {
                    CompLoader.remove(contentContainer);
                }, 250);
            }
        });
    }

    static createConfirmation(text, onConfirm, onCancel) {
        let popup = CompPopup.create(`${Config.url}/modules/popups/confirmation/ModulePopupsConfirmation.php?text=` + text, "32_icon_center", "Confirmation", 250, 480);
        popup.onload = () => {
            popup.find(".moduleCenterPopUpButtonsDeny").click(() => {
                this.remove(popup);
                onCancel();
            });
            popup.find(".moduleCenterPopUpButtonsApprove").click(() => {
                this.remove(popup);
                onConfirm();
            });
        }
    }

    static createModeration(text, onValid) {
        let popup = CompPopup.create(`${Config.url}/modules/popups/moderation/ModulePopupsModeration.php?text=` + text, "32_icon_chat", "Signalement", 445, 480);
        popup.onload = () => {
            popup.find(".validBtn").click(() => {
                let text = popup.find(".textArea").val();
                if (text.length > 5) {
                    this.remove(popup);
                    onValid(text);
                }
            });
        }
    }
}