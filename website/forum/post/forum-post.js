import {Config} from "../../../app/configs/config.js";
import {CompNotification} from "../../../assets/comp/notification/comp-notification.js";
import {Website} from "../../website.js";
import {CompPopup} from "../../../assets/comp/popup/comp-popup.js";

export class ForumPost {

    addPostButton;
    postThreadId;
    postsContainer;
    editorContainer;

    constructor() {
        this.editorContainer = $(".forumPostWriteBoxEditor");
        this.postsContainer = $(".forumPostWriteContainer");
        this.postThreadId = $(".postThreadId").html();
        this.addPostButton = $(".forumPostWriteBoxButton");
        this.addPostButton.click(() => {
            if (!this.addPostButton.hasClass("active")) {
                this.addPostButton.addClass("active");
                let message = tinymce.get("editor").getContent();
                this.createPost("create", this.postThreadId, message);
            }
        });

        let posts = $(".forumPostWriteBoxPost");
        posts.each((x) => {
            let post = $(posts[x]);
            this.initPost(post);
        });

        document.addEventListener('click', (event) => {
            const target = event.target;

            if (target.matches('.forumPostReactionIcon')) {
                const postId = target.getAttribute('data-post-id');
                const reactionType = target.getAttribute('data-type-reaction');
                this.addReaction(postId, reactionType, target);
                this.loadReaction(postId, reactionType, target);
                return;
            }

            if (target.matches('.reactionCount')) {
                const typeMatch = target.className.match(/type(\d)Count/);
                if (typeMatch) {
                    const type = typeMatch[1];
                    const users = JSON.parse(target.getAttribute('data-users') || '[]');
                }
                return;
            }
        });
    }


    createPost(type, threadId, message, postId) {
        return new Promise(resolve => {
            $.ajax({
                type: "POST",
                url: `${Config.url}/website/forum/action/ActionForumPostCreate.php`,
                data: {
                    type: type,
                    threadId: threadId,
                    message: message,
                    postId: postId
                },
                dataType: "json",
                success: (json) => {
                    if (json.success) {
                        this.templatePost(json['createdId'])
                            .then(template => {
                                if (type === "create") {
                                    let elem = $(template);
                                    elem.insertBefore(this.editorContainer);
                                    this.initPost(elem);
                                    let editor = tinymce.get('editor');
                                    if (editor)
                                        editor.setContent('');

                                    elem.css('transform', 'scale(0.8)');

                                    setTimeout(() => {
                                        elem.css('transition', '0.2s');
                                        elem.css('transform', 'scale(1)');
                                    });
                                }

                                this.addPostButton.removeClass("active");
                                resolve(template);
                            });
                    } else {
                        CompNotification.create("Billy", json.response, undefined, undefined, true);
                    }
                },
                error: () => {
                    this.addPostButton.removeClass("active");
                }
            });
        });
    }

    deletePost(postId, post) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/forum/action/ActionForumPostDelete.php`,
            data: {
                id: postId
            },
            dataType: "json",
            success: (json) => {
                if (json.success) {
                    post.css('transform', 'scale(1)');
                    setTimeout(() => {
                        post.css('transition', '0.2s');
                        post.css('transform', 'scale(0.8)');
                        post.css('opacity', '0');
                        setTimeout(() => {
                            post.remove();
                        }, 200);
                    });
                } else {
                    CompNotification.create("Billy", "Le commentaire n'a pas été supprimé.", undefined, undefined, true);
                }
            }
        });
    }

    actionThread(threadId, type, post) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/forum/action/ActionForumThreadAction.php`,
            data: {
                type: type,
                threadId: threadId
            },
            dataType: "json",
            success: (json) => {
                if (json.success) {
                    let button;
                    switch (type) {
                        case "epingle":
                            button = post.find(".forumPostWriteBubbleButtonStick");
                            button.html(json.response ? "Retirer le sujet" : "Épingler le sujet");
                            break;
                        case "delete":
                            Website.routerExec(`${Config.url}/forum/my`);
                            break;
                        case "close":
                            button = post.find(".forumPostWriteBubbleButtonClose");
                            button.html(json.response ? "Ouvrir le sujet" : "Fermer le sujet");
                            break;
                    }
                } else {
                    CompNotification.create("Billy", "Oops ! Quelque chose s'est mal passé, veuillez re-essayer.", undefined, undefined, true);
                }
            }
        });
    }

    initPost(post) {
        let postId = post.attr("data-id");
        let threadId = post.attr("data-thread");

        post.find(".forumPostWriteBubbleButtonStick").click(() => {
            this.actionThread(threadId, "epingle", post);
        });

        post.find(".forumPostWriteBubbleButtonClose").click(() => {
            this.actionThread(threadId, "close", post);
        });

        post.find(".forumPostWriteBubbleButtonDelete").click(() => {
            if (post.hasClass("forumPostWriteBoxFirst")) {
                this.actionThread(threadId, "delete", post);
            } else {
                this.deletePost(postId, post);
            }
        });

        post.find(".forumPostWriteBubbleButtonEdit").click(() => {
            let popup = CompPopup.create(`${Config.url}/website/forum/post/edit/ForumPostEdit.php?id=` + postId, "32_icon_chat", "Modifier le post", 430, 580);
            popup.onload = () => {
                popup.find(".forumPostEditValidBtn").click(() => {
                    let text = tinymce.get("editorEdit").getContent();

                    this.createPost("edit", this.postThreadId, text, postId)
                        .then(value => {
                            let doc = new DOMParser().parseFromString(value, 'text/html');

                            post.html(doc.querySelector(".forumPostWriteBox").innerHTML);
                            this.initPost(post);
                        });

                    CompPopup.remove(popup);
                });
            }
        });
    }

    async templatePost(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `${Config.url}/website/forum/action/ActionForumPostTemplate.php`,
                data: {
                    postId: id
                },
                dataType: "json",
                success: (json) => {
                    if (json['template'] != null) {
                        resolve(json['template']);
                    } else {
                        reject();
                    }
                }
            });
        });
    }
    addReaction(postId, reactionType, reactionTarget) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/forum/action/ActionForumReaction.php`,
            data: {
                postId: postId,
                reactionType: reactionType
            },
            dataType: "json",
            success: (json) => {
                if (json.reponse !== undefined) {
                    let reponse = json.reponse;
                    let type = json.typeReact;

                    switch (reponse) {
                        case "new":
                            this.updateReaction(true, reactionTarget);
                            break;
                        case "remove":
                            this.updateReaction(false, reactionTarget);
                            break;
                        case "edit":
                            this.updateReaction(true, reactionTarget);
                            this.updateReaction(false, reactionTarget);
                            break;
                        default:
                            break;
                    }
                } else {
                    CompNotification.create("Billy", "Erreur lors de l'ajout de la réaction.", undefined, undefined, true);
                }
            },
            error: () => {
                CompNotification.create("Billy", "Erreur lors de la requête d'ajout de réaction.", undefined, undefined, true);
            }
        });
    }

    updateReaction(adding, reactionTarget) {
        const filterCss = adding ? 'grayscale(100%)' : 'grayscale(0%)';
        reactionTarget.style.filter = filterCss;
    }

    loadReaction(postId, reactionType, reactionTarget) {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/forum/action/ActionForumLoadReaction.php`,
            data: {
                postId: postId,
                reactionType: reactionType
            },
            dataType: "json",
            success: (json) => {
                if (json.reponse && Array.isArray(json.reponse)) {
                    const reactionContainer = reactionTarget.parentElement;

                    const buttons = reactionContainer.querySelectorAll('.reactionCount');
                    buttons.forEach(button => {
                        button.innerText = 0;
                        button.setAttribute('data-usernames', "Aucune réaction");
                        button.setAttribute('data-users', JSON.stringify([]));
                    });

                    json.reponse.forEach(reaction => {
                        const type = reaction.type;
                        const count = reaction.reaction_count;
                        const users = reaction.users ? JSON.parse(reaction.users) : [];
                        let usernames = users.map(user => user.username).join(', ');
                        const button = reactionContainer.querySelector(`.type${type}Count`);
                        if (button) {
                            button.innerText = count;
                            if (count > 0) {
                                button.setAttribute('data-usernames', usernames);
                                if (users.length === 0) {
                                    button.setAttribute('data-usernames', count + " réaction(s)");
                                }
                            }
                            button.setAttribute('data-users', JSON.stringify(users));
                        }
                    });
                } else {
                    CompNotification.create("Billy", "Erreur lors de l'ajout de la réaction.", undefined, undefined, true);
                }
            },
            error: () => {
                CompNotification.create("Billy", "Erreur lors de la requête d'ajout de réaction.", undefined, undefined, true);
            }
        });
    }
}