import {CompHabblet} from "../../../assets/comp/habblet/comp-habblet.js";

export class ModuleClientClothing {
    static packet(data) {
        this.init(data);
    }

    static init(data) {
        let image = decodeURIComponent(escape(window.atob(data.image.replaceAll("!#egal!#", "=").replaceAll("!#et!#", "&"))));
        //language=HTML
        let root = $(`
            <div class="ModuleClientClothing">
                <div class="look2">
                    <div class="look3">${data.name}</div>
                    <div class="look4">
                        <div class="look5">
                            <div class="look6"></div>
                            <img class="look7" src="${image}"/>
                        </div>
                        <div class="look8"></div>
                    </div>
                    <div class="look11">Annuler</div>
                    <div class="look9">
                        <div class="look10"></div>
                        Transformer
                    </div>
                </div>
            </div>
        `);

        $("body").append(root);

        root.find(".look11").click(() => {
            root.remove();
        });

        root.find(".look9").click(() => {
            root.remove();
            CompHabblet.sendRedeemClothing(data.id);
        });
    }
}