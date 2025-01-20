export class CompLoader {
    static render(element, center) {
        //language=HTML
        element.append(`
            <div class="CompLoader ${center ? 'centerLoader' : ''}">
                <div class="CompLoaderSpinner"></div>
            </div>`);
    }

    static remove(element) {
        element.find(".CompLoader").remove();
    }
}