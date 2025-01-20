import {CompLoader} from "../../loader/comp-loader.js";

export class CompPlayersResearch {

    container = null;
    input = null;
    friends = false;

    constructor(container, input, friends) {
        this.container = container;
        this.input = input;
        this.friends = friends;

        this.input[0].addEventListener('keyup', (e) => {
            const el = e.target;
            if (el === undefined || el.value === undefined || el.value === null) return;

            if (el.value.length > 0) {
                this.container.show();
                this.render(el.value);
            } else {
                this.container.hide();
            }
        });
    }

    render(query) {
        this.container.html("");
        CompLoader.render(this.container);
        $.ajax({
            type: "GET",
            url: `/assets/comp/players/research/comp-players-research.php?friends=${this.friends}&search=${query}`,
            success: (data) => {
                this.container.append(data);
                CompLoader.remove(this.container);

                this.container[0].querySelectorAll('.box').forEach((el) => {
                    $(el).click(() => {
                        this.onPlayerClick(el.getAttribute("data-id"));
                    })
                });
            }
        });
    }

    onPlayerClick(id) {}
}