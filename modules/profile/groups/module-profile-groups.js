import {CompRoutabs} from "../../../assets/comp/routabs/comp-routabs.js";
import {Config} from "../../../app/configs/config.js";

export class ModuleProfileGroups {
    module;
    router = null;

    constructor() {
        this.module = $(".moduleProfileGroups").last();

        this.initRoutes();
    }

    initRoutes() {
        let buttons = this.module.find(".moduleProfileGroupsBubble");
        let routes = [];
        buttons.each((x) => {
            let button = buttons[x];
            let groupId = button.getAttribute("data-group-id");
            routes.push({
                selector: ".ModuleGroup-" + groupId,
                module: `${Config.url}/modules/profile/groups/view/ModuleProfileGroupsView.php?groupId=` + groupId
            });
        });

        if (routes.length > 0) {
            this.router = new CompRoutabs(this.module, this.module.find(".moduleProfileGroupsBoxRight"), routes);
            CompRoutabs.globalId('moduleProfileGroups', this.router);
        }
    }
}