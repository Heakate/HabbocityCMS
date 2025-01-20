import {CompHabblet} from "../../../assets/comp/habblet/comp-habblet.js";
import {Utils} from "../../../assets/js/Utils.js";

export class ModuleClientQuickPoll {

    static root = undefined;

    static packet(packet) {
        switch (packet.type) {
            case "start":
                this.init(packet.question);
                break;
            case "end":
                this.end();
                break;
            case "update":
                this.update(packet.yesvotes, packet.novotes);
                break;
        }
    }

    static init(question) {
        //language=HTML
        this.root = $(`
            <div class="ModuleClientQuickPoll">
                <div class="qp3">
                    <div class="qp4"></div>
                    <div class="qp5"></div>
                    <div class="qp6">
                        <div class="qp12" style="width:50%"></div>
                        <div class="qp11" style="width:50%;"></div>
                    </div>
                    <div class="qp8">${Utils.htmlspecialchars(question)}</div>
                    <div class="qp9">0</div>
                    <div class="qp10">0</div>
                </div>
            </div>
        `);

        $("body").append(this.root);
        this.root.animate({top: "0px"}, 100);

        this.root.find(".qp4").click(() => this.sendVote(0));
        this.root.find(".qp5").click(() => this.sendVote(1));
    }

    static update(voteTrue, voteFalse) {
        voteTrue = parseInt(voteTrue);
        voteFalse = parseInt(voteFalse);

        let percentage = voteFalse + voteTrue;
        let percentageTrue = (voteTrue * 100) / percentage;
        let percentageFalse = (voteFalse * 100) / percentage;

        this.root.find(".qp12").css({width: percentageFalse + "%"});
        this.root.find(".qp11").css({width: percentageTrue + "%"});
        this.root.find(".qp9").text(voteFalse);
        this.root.find(".qp10").text(voteTrue);
    }

    static end() {
        setTimeout(() => this.root.hide(), 100);

        this.root.find(".qp12").css({width: "50%"});
        this.root.find(".qp11").css({width: "50%"});
        this.root.animate({top: "-200px"}, 100);
    }

    static sendVote(vote) {
        let msg = {
            packetId: "quickpoll",
            type: "vote",
            value: vote
        }

        CompHabblet.sendMessage(msg);
    }

}
