export class CompButtons {

    static createFloater(container) {
        let floater = $(`<div class="CompButtonsFloater"></div>`);
        container.append(floater);

        return floater;
    }

    static create(container, saveText, saveFunc, cancelText, cancelFunc) {
        let floater = this.createFloater(container);
        //language=HTML
        let buttons = $(`
            <div class="CompButtons">
                ${saveText && saveFunc ? `<div class="button save">${saveText}</div>` : ``}
                ${cancelText && cancelFunc ? `<div class="button cancel">${cancelText}</div>` : ``}
            </div>
        `);
        floater.append(buttons);
        floater.animate({bottom: "15px"}, 100);

        buttons.find(".save").click(() => saveFunc());
        buttons.find(".cancel").click(() => {
            floater.animate({bottom: "-100px"}, 100);
            setTimeout(() => floater.remove(), 100);
            cancelFunc();
        });

        return floater;
    }
}