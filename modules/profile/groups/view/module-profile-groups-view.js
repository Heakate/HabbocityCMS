import {CompHabblet} from "../../../../assets/comp/habblet/comp-habblet.js";
import {CompPopup} from "../../../../assets/comp/popup/comp-popup.js";
import {CompTabs} from "../../../../assets/comp/tabs/comp-tabs.js";
import {CompRoutabs} from "../../../../assets/comp/routabs/comp-routabs.js";

export class ModuleProfileGroupsView {
    module;
    playerId = null;

    constructor() {
        this.module = $(".moduleProfileGroupsBoxDetail").last();
        this.playerId = parseInt(this.module.attr("data-player-id"));
        this.init();
    }

    init() {
        let ownerProfile = this.module.find('.moduleProfileGroupsOwner');
        ownerProfile.click(() => {
            let ownerId = ownerProfile.attr('data-id');
            CompTabs.createProfile(ownerId);
        });

        let favoriteButton = this.module.find(".moduleProfileGroupsBoxFavorite");
        favoriteButton.click(() => {
            let groupId = favoriteButton.attr("data-id");
            CompPopup.createConfirmation("Veux-tu ajouter le groupe en favori ?", () => {
                CompHabblet.sendFavoriteGroup(groupId);
                CompRoutabs.globalReload(`moduleProfileTabs${this.playerId}`);
            }, () => {

            });
        });

        let qgButton = this.module.find(".moduleProfileGroupsBoxQg");
        qgButton.click(() => {
            let roomId = qgButton.attr("data-id");
            CompHabblet.sendJoinRoom(roomId);
        });

        let joinButton = this.module.find(".moduleProfileGroupsBoxJoin");
        joinButton.click(() => {
            let groupId = joinButton.attr("data-id");
            CompHabblet.sendJoinGroup(groupId);
            CompRoutabs.globalReload(`moduleProfileTabs${this.playerId}`);
        });

        let leaveButton = this.module.find(".moduleProfileGroupsBoxLeave");
        leaveButton.click(() => {
            let groupId = leaveButton.attr("data-id");
            CompPopup.createConfirmation("Tu es sûr de vouloir quitter le groupe ?", () => {
                CompHabblet.sendLeaveGroup(groupId);
                CompRoutabs.globalReload(`moduleProfileTabs${this.playerId}`);
            }, () => {

            });
        });

        let deleteButton = this.module.find(".moduleProfileGroupsBoxDelete");
        deleteButton.click(() => {
            let groupId = deleteButton.attr("data-id");
            CompPopup.createConfirmation("Es-tu sûr de vouloir supprimer le groupe ?", () => {
                CompHabblet.sendDeleteGroup(groupId);
                CompRoutabs.globalReload(`moduleProfileTabs${this.playerId}`);
            }, () => {

            });
        });

        let showMembersButton = this.module.find(".moduleProfileGroupsBoxMembers");
        showMembersButton.click(() => {
            let groupId = showMembersButton.attr("data-id");
            CompHabblet.sendShowGroupMembers(groupId);
        });
    }
}

new ModuleProfileGroupsView();