import {CompDraggable} from "../draggable/comp-draggable.js";
import {CompLoader} from "../loader/comp-loader.js";

export class CompTabs {
    static root = undefined;
    static index = 2;
    static positions = {};
    static tabs = {};

    static init() {
        CompTabs.root = $(`<div class="CompTabs"></div>`);
        $("body").append(CompTabs.root);
    }

    static reload(url) {
        let tab = this.tabs[url];
        if (tab)
            this.createLoadContent(tab, url);
    }

    static create(url, icon, title, height, width, onClose, onLoad) {
        if (this.tabs[url] !== undefined) {
            CompTabs.index++;
            this.tabs[url].css('z-index', CompTabs.index);
            return;
        }

        if (CompTabs.root === undefined) {
            CompTabs.init();
        }

        if (typeof this.positions[url] == "undefined") {
            this.positions[url] = {x: 100, y: 60};
        }

        let left = this.positions[url].x;
        let top = this.positions[url].y;

        //language=HTML
        let tab = $(`
            <div style="resize:both;opacity: 1;transform: scale(0.8);transition: 0.2s ease-in-out;left:${left}px;top:${top}px;height: ${height}px;width: ${width}px;z-index: ${this.index};"
                 class="tab">
                <div class="tabHead">
                    <div class="tabHeadIcon">
                        <img src="../../../assets/img/${icon}.png"/>
                    </div>
                    <div class="tabHeadTitle">
                        ${title}
                    </div>
                    <div class="tabHeadClose tabCloseButton"></div>
                </div>
                <div class="tabContent"></div>
            </div>`);
        CompTabs.root.append(tab);
        CompDraggable.draggable(tab[0], tab[0].getElementsByClassName("tabHead")[0], (x, y) => {
            this.positions[url] = {x: x, y: y};
        });
        tab.click(() => tab.css("z-index", CompTabs.index++));
        setTimeout(() => tab.css({transform: 'scale(1)', opacity: 1}), 0);
        setTimeout(() => tab.css({transition: "0s"}), 200);

        this.tabs[url] = tab;
        this.createLoadContent(tab, url, onClose, onLoad);
    }

    static createLoadContent(tab, url, onClose, onLoad) {
        let contentContainer = tab.find(".tabContent");
        contentContainer.html("");
        CompLoader.render(contentContainer);
        $.ajax({
            type: "GET",
            url: url,
            success: (data) => {
                contentContainer.append(data);
                tab.find(".tabCloseButton").click(() => {
                    delete this.tabs[url];
                    tab.remove();
                    if (onClose)
                        onClose();
                });

                setTimeout(() => {
                    CompLoader.remove(contentContainer);
                }, 250);

                if (onLoad)
                    onLoad();
            },
            error: () => {
                tab.find(".tabCloseButton").click(() => {
                    delete this.tabs[url];
                    tab.remove();
                    if (onClose)
                        onClose();
                });
            }
        });
    }

    static reloadProfile(playerId, username) {
        this.reload("/modules/profile/ModuleProfile.php?playerId=" + playerId);
        this.reload("/modules/profile/ModuleProfile.php?playerId=0&username=" + username);
    }

    static createProfile(playerId, username) {
        CompTabs.create("/modules/profile/ModuleProfile.php?playerId=" + playerId + (username ? "&username=" + username : ""), "32_icon_profil", "Profil", 692, 670);
    }

    static createCenter() {
        CompTabs.create("/modules/center/ModuleCenter.php", "32_icon_center", "City Trade Center", 700, 840);
    }

    static createChat() {
        CompTabs.create("/modules/chat/ModuleChat.php", "32_icon_chat", "Messages privés", 520, 670);
    }

    static createCalendar() {
        CompTabs.create("/modules/calendar/ModuleCalendar.php", "32_icon_center", "Calendrier VIP", 450, 684);
    }

    static createGamers() {
        CompTabs.create("/modules/gamers/ModuleGamers.php", "32_icon_gamers", "City Prestiges", 650, 775);
    }

    static createOrga() {
        CompTabs.create("/modules/orga/ModuleOrga.php", "32_icon_organisation", "Organisations", 690, 900);
    }
}