import {CompRoutabs} from "../../assets/comp/routabs/comp-routabs.js";
import {CompUploader} from "../../assets/comp/uploader/comp-uploader.js";
import {CompButtons} from "../../assets/comp/buttons/comp-buttons.js";
import {CompTabs} from "../../assets/comp/tabs/comp-tabs.js";
import {CompNotification} from "../../assets/comp/notification/comp-notification.js";
import {Config} from "../../app/configs/config.js";

export class ModuleProfile {
    module;
    moduleProfilePlayerId;
    ModuleProfilePlayerUsername;
    moduleProfileFigureUrl;
    moduleProfileBannerUrl;
    buttons = false;
    buttonsFloater = undefined;
    moduleBannerUploader = undefined;
    moduleAvatarUploader = undefined;
    router = null;

    constructor() {
        this.module = $(".moduleProfile").last();
        this.moduleProfilePlayerId = parseInt(this.module.find(".ModuleProfilePlayerId").html());
        this.moduleProfilePlayerUsername = this.module.find(".ModuleProfilePlayerUsername").html();
        this.moduleProfileFigureUrl = this.module.find(".ModuleProfileFigureUrl").html().replaceAll("&amp;", "&");
        this.moduleProfileBannerUrl = this.module.find(".ModuleProfileBannerUrl").html().replaceAll("&amp;", "&");
        this.buttons = false;
        this.buttonsFloater = undefined;
        this.moduleBannerUploader = undefined;
        this.moduleAvatarUploader = undefined;

        this.initRoutes();
        this.initUploader();
        this.initFriendButtons();
        this.initRelationsButtons();
        this.initMsgButton();
    }

    initRoutes() {
        this.router = new CompRoutabs(this.module, this.module.find(".moduleProfileTabsContainer"), [{
            selector: ".TabGroups",
            module: `${Config.url}/modules/profile/groups/ModuleProfileGroups.php?playerId=` + this.moduleProfilePlayerId
        }, {
            selector: ".TabFriends",
            module: `${Config.url}/modules/profile/friends/ModuleProfileFriends.php?playerId=` + this.moduleProfilePlayerId
        }, {
            selector: ".TabRooms",
            module: `${Config.url}/modules/profile/rooms/ModuleProfileRooms.php?playerId=` + this.moduleProfilePlayerId
        }, {
            selector: ".TabTopics",
            module: `${Config.url}/modules/profile/topics/ModuleProfileTopics.php?playerId=` + this.moduleProfilePlayerId
        }, {
            selector: ".TabRichess",
            module: `${Config.url}/modules/center/inventory/richess/ModuleCenterInventoryRichess.php?playerId=` + this.moduleProfilePlayerId
        }, {
            selector: ".TabPhotos",
            module: `${Config.url}/modules/profile/photos/ModuleProfilePhotos.php?playerId=` + this.moduleProfilePlayerId
        }]);

        CompRoutabs.globalId(`moduleProfileTabs${this.moduleProfilePlayerId}`, this.router);
    }

    initFriendButtons() {
        let buttons = this.module.find(".moduleProfileActionsFriend");
        buttons.each((x) => {
            let button = buttons[x];
            let state = button.getAttribute("data-state");
            let decline = button.getAttribute("data-decline");

            button.addEventListener("click", () => {
                let buttonText = $(button).find(".moduleProfileActionsFriendText");
                buttonText.html("Chargement...");

                $.ajax({
                    type: "POST",
                    url: `${Config.url}/modules/profile/action/ModuleProfileActionFriend.php`,
                    data: {
                        playerId: this.moduleProfilePlayerId,
                        state: state,
                        decline: decline
                    },
                    dataType: "json",
                    success: (json) => {
                        CompTabs.reloadProfile(this.moduleProfilePlayerId, this.moduleProfilePlayerUsername);
                    }
                });
            });
        });
    }

    initMsgButton() {
        let btn = this.module.find('.moduleProfileActionsMessage')[0];
        if (btn) {
            btn.addEventListener('click', () => {
                const playerId = btn.getAttribute("data-playerid");
                CompTabs.createChat();
                window['ModuleChatOpened'] = (module) => {
                    module.openConversation(playerId);
                }
            });
        }
    }

    initUploader() {
        this.moduleAvatarUploader = new CompUploader(this.module.find(".ModuleProfileAvatarEdition"), 8, CompUploader.allowProfile());
        this.moduleAvatarUploader.initProfile(this.module.find(".moduleProfileAvatar"), this.module.find(".ModuleProfileAvatarDelete"), this.moduleProfileFigureUrl, ["AvatarFigure", "AvatarImage"]);

        this.moduleBannerUploader = new CompUploader(this.module.find(".ModuleProfileCoverBannerEdition"), 8, CompUploader.allowProfile());
        this.moduleBannerUploader.initProfile(this.module.find(".moduleProfileCoverBannerContainer"), this.module.find(".ModuleProfileCoverBannerDelete"), this.moduleProfileBannerUrl);

        this.moduleAvatarUploader.onChange = () => this.initButtons();
        this.moduleBannerUploader.onChange = () => this.initButtons();
    }

    initButtons() {
        if (!this.buttons) {
            this.buttons = true;
            this.buttonsFloater = CompButtons.create(this.module, "Enregistrer", () => this.saveProfile(), "Annuler", () => CompTabs.reloadProfile(this.moduleProfilePlayerId, this.moduleProfilePlayerUsername));
        }
    }

    removeButtons() {
        this.buttons = false;
        this.buttonsFloater.animate({bottom: "-100px"}, 100);
        setTimeout(() => this.buttonsFloater.remove(), 100);
    }

    saveProfile() {
        let form = new FormData();
        form.append("avatar", this.moduleAvatarUploader.pickedFile);
        form.append("deletedAvatar", this.moduleAvatarUploader.deletedFile);

        form.append("banner", this.moduleBannerUploader.pickedFile);
        form.append("deletedBanner", this.moduleBannerUploader.deletedFile);

        form.append("playerId", this.moduleProfilePlayerId + "");

        $.ajax({
            url: `${Config.url}/modules/profile/action/ModuleProfileActionSave.php`,
            type: 'post',
            data: form,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: (response) => {
                CompNotification.create("Billy", response.response, undefined, undefined, true);
                this.removeButtons();
            }
        });
    }

    initRelationsButtons() {
        let relations = this.module.find(".moduleProfileRelationOpenProfile");
        relations.each((x) => {
            let button = relations[x];
            let playerId = button.getAttribute("data-id");

            button.addEventListener("click", () => {
                CompTabs.createProfile(playerId);
            });
        });
    }
}