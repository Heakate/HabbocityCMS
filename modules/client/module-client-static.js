
export class ModuleClientStatic {

    /**
     * @deprecated
     */
    static updateButtonNotification(name, notifications) {
        let button = $(".ModuleClient").last().find(`.${name}`);
        let roundNotification = button.find(".ModuleClientMenuButtonNotifications");
        if (notifications > 0) {
            if (roundNotification.length) {
                roundNotification.html(notifications);
            } else {
                button.append(`<div class="ModuleClientMenuButtonNotifications">${notifications}</div>`);
            }
        } else {
            if (roundNotification.length) {
                roundNotification.remove();
            }
        }
    }
}