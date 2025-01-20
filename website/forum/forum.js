import {CompRoutabsResearch} from "../../assets/comp/routabs/research/comp-routabs-research.js";
import {Config} from "../../app/configs/config.js";

export class Forum {

    forumTopicsContainer = null;
    forumTopicsSearch = null;
    forumTitle = null;
    forumTitleBoxRight = null;
    forumPostWriteContainer = null;
    forumHeaderBubbleCategory = null;
    forumHeaderBubbleCategoryPicker = null;

    constructor() {
        this.forumTopicsContainer = $(".forumTopicsContainer");
        this.forumTopicsSearch = $(".forumTopicsSearch");
        this.forumTitle = $(".forumTitle");
        this.forumTitleBoxRight = $(".forumTitleBoxRight");
        this.forumPostWriteContainer = $(".forumPostWriteContainer");
        this.forumHeaderBubbleCategory = $(".forumHeaderBubbleCategoryFirst");
        this.forumHeaderBubbleCategoryPicker = $(".forumHeaderPicker");

        let forumTitleValue = this.forumTitle.html();

        if(document.querySelector('.forumSearchBoxWrite')) {
            let route = new CompRoutabsResearch(this.forumTopicsSearch, $('.forumSearchBoxWrite'), Config.url + '/website/forum/action/ActionForumSearch.php?search=');
            route.onKey = (search) => {
                if (search.length > 0) {
                    this.forumTopicsContainer.hide();
                    this.forumPostWriteContainer.hide();
                    this.forumTopicsSearch.css({display: "flex"});
                    this.forumTitleBoxRight.hide();
                    this.forumTitle.html(search);
                } else {
                    this.forumTopicsSearch.hide();
                    this.forumTopicsSearch.html("");
                    this.forumTopicsContainer.css({display: "flex"});
                    this.forumPostWriteContainer.show();
                    this.forumTitleBoxRight.css({display: "flex"});
                    this.forumTitle.html(forumTitleValue);
                }
            }
        }

        let opened = false;
        this.forumHeaderBubbleCategory.click(() => {
            if (!opened) {
                this.forumHeaderBubbleCategoryPicker.css({display: "flex"})
                opened = true;
            } else {
                this.forumHeaderBubbleCategoryPicker.hide();
                opened = false;
            }
        });
    }
}