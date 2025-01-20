import {CompNotification} from "../notification/comp-notification.js";

export class CompUploader {

    deletedFile = false;
    pickedFile = null;
    filesInput = null;

    constructor(button, maxMoSize, allowTypes) {
        let file = $(`<input class="CompUploader" accept="${allowTypes}" type="file" name="file" />`);
        button.append(file);
        this.filesInput = file[0];

        this.filesInput.addEventListener("change", () => {
            for (let i = 0; i < this.filesInput.files.length; i++) {
                let file = this.filesInput.files[i];
                if (this.numberBytesToMO(file.size) > maxMoSize) {
                    CompNotification.create("Billy", "Attention, la taille limite a été dépassée.", undefined, undefined, true);
                } else {
                    this.onPick(file);
                    this.onChange();
                }
            }

            this.filesInput.value = "";
        });
    }

    /**
     * ons
     */

    onPick(file) {

    }

    onChange() {

    }

    /**
     * inits
     */

    initProfile(container, deleteButton, deleteUrl, classes) {
        let imgContainer = container.find("img");

        this.onPick = (file) => {
            this.pickedFile = file;
            this.deletedFile = false;
            if (file !== undefined) {
                this.fileToBase64(file, (data) => {
                    imgContainer.attr("src", data);
                    let deleteClass = classes ? classes.find(v => !imgContainer.attr("class").includes(v)) : undefined;
                    if (deleteClass !== undefined)
                        imgContainer.attr("class", deleteClass);
                });
            }
        }

        deleteButton.click(() => {
            imgContainer.attr("src", deleteUrl);
            let deleteClass = classes ? classes.find(v => !imgContainer.attr("class").includes(v)) : undefined;
            if (deleteClass !== undefined)
                imgContainer.attr("class", deleteClass);

            this.pickedFile = undefined;
            this.deletedFile = true;

            this.onChange();
        });

    }

    /**
     * logic
     */
    numberBytesToMO(bytes) {
        return bytes / 1048576;
    }

    fileToBase64(file, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            callback(e.target.result, e);
        };
    }

    /**
     * allows
     */

    static allowProfile() {
        return ["image/png", "image/gif", "image/jpeg"];
    }

}