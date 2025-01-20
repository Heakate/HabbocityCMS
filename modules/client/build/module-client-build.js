import {CompDraggable} from "../../../assets/comp/draggable/comp-draggable.js";
import {CompHabblet} from "../../../assets/comp/habblet/comp-habblet.js";

export class ModuleClientBuild {

    static root = undefined;
    static values = {};
    static increments = {rotation: 1, hauteur: 0.1, etat: 1};
    static inputs = {};
    static floodTime = 0;

    static packet(packet) {

        switch (packet.type) {
            case "start":
                this.init();
                break;
            case "end":
                this.end();
                break;
        }
    }

    static init() {
        //language=HTML
        this.root = $(`
            <div class="ModuleClientBuild">
                <div class="mb2">
                    <div class="mb3"></div>
                    <div class="mb4">Mode construction</div>
                    <div class="mbclose"></div>
                </div>
                <div class="mb5">
                    <div class="mb6">
                        <input class="mb7" data-type="rotation" name="rotation" autocomplete="off"
                               placeholder="Rotation" type="text"/>
                        <div class="mb8"></div>
                        <div class="mb11" data-type="rotation">STOP</div>
                        <div class="mb12" data-type="rotation">+</div>
                        <div class="mb13" data-type="rotation">-</div>

                    </div>
                    <div class="mb6">
                        <input class="mb7" data-type="hauteur" name="hauteur" autocomplete="off" placeholder="Hauteur"
                               type="text"/>
                        <div class="mb9"></div>
                        <div class="mb11" data-type="hauteur">STOP</div>
                        <div class="mb12" data-type="hauteur">+</div>
                        <div class="mb13" data-type="hauteur">-</div>
                    </div>
                    <div class="mb6">
                        <input class="mb7" data-type="etat" name="etat" autocomplete="off" placeholder="État"
                               type="text"/>
                        <div class="mb10"></div>
                        <div class="mb11" data-type="etat">STOP</div>
                        <div class="mb12" data-type="etat">+</div>
                        <div class="mb13" data-type="etat">-</div>
                    </div>
                </div>
            </div>
        `);
        $("body").append(this.root);
        CompDraggable.draggable(this.root[0], this.root[0].getElementsByClassName("mb2")[0], () => {
        });

        this.initHandlers();
    }

    static end() {
        this.root.remove();
        this.root = undefined;
    }

    static initHandlers() {
        this.root[0].querySelectorAll('.mb11').forEach((el) => {
            el.addEventListener('click', (e) => {
                this.stop(e.target.dataset.type);
            });
        });
        this.root[0].querySelectorAll('.mb12').forEach((el) => {
            el.addEventListener('click', (e) => {
                this.up(e.target.dataset.type);
            });
        });
        this.root[0].querySelectorAll('.mb13').forEach((el) => {
            el.addEventListener('click', (e) => {
                this.down(e.target.dataset.type);
            });
        });

        this.root[0].querySelectorAll('.mb7').forEach((el) => {
            this.inputs[el.dataset.type] = el;
            el.addEventListener('keyup', (e) => {
                this.handle(e.target.value, e.target.dataset.type);
            });
        });

        this.root[0].querySelector('.mbclose').addEventListener('click', () => {
            this.end();
        });
    }

    static up(type) {
        let nextValue = this.values[type] ? (this.values[type] + this.increments[type]) : this.increments[type];
        let input = this.inputs[type];

        this.handle(nextValue, type);
        input.value = nextValue;
    }

    static down(type) {
        let prevValue = this.values[type] ? (this.values[type] - this.increments[type]) : -this.increments[type];
        let input = this.inputs[type];

        this.handle(prevValue, type);
        input.value = prevValue;
    }

    static stop(type) {
        const timeNow = Math.floor(Date.now() / 1000);
        if (timeNow > this.floodTime) {
            let input = this.inputs[type];
            input.value = '';
            delete this.values[type];

            this.floodTime = Math.floor(Date.now() / 1000);

            CompHabblet.sendMessage({
                packetId: "buildmode", type: "stop", value: type
            });
        }
    }

    static handle(value, type) {
        this.values[type] = value;
        value = parseFloat(value);
        if (type === "hauteur") {
            value = Number(value.toFixed(2));
        }
        this.floodTime = Math.floor(Date.now() / 1000);

        CompHabblet.sendMessage({
            packetId: "buildmode", type: type, value: value
        });
    }
}