import {CompRoutabs} from "../../assets/comp/routabs/comp-routabs.js";
import {Config} from "../../app/configs/config.js";

export class ModuleOrga {
    module;

    constructor() {
        this.module = $(".orgaModule").last();


        new CompRoutabs(this.module, this.module.find(".orgaModuleContainer"), [
            {
                selector: ".ModuleNavList",
                module: `${Config.url}/modules/orga/list/ModuleOrgaList.php`
            },
            {
                selector: ".ModuleNavRoles",
                module: `${Config.url}/modules/orga/roles/ModuleOrgaRoles.php`
            },
            {
                selector: ".ModuleNavStaff",
                module: `${Config.url}/modules/orga/staff/ModuleOrgaStaff.php`
            },
            {
                selector: ".ModuleNavRewards",
                module: `${Config.url}/modules/orga/rewards/ModuleOrgaRewards.php`
            },
            {
                selector: ".ModuleNavJobs",
                module: `${Config.url}/modules/orga/jobs/ModuleOrgaJobs.php`
            }
        ], false);
    }
}