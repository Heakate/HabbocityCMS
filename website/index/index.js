import {Config} from "../../app/configs/config.js";
import {CompNotification} from "../../assets/comp/notification/comp-notification.js";
import {CompPopup} from "../../assets/comp/popup/comp-popup.js";

export class Index {

    usernameInput;
    passwordInput;

    loginButton;
    playChecked;
    playIsChecked = false;
    indexPassword;

    constructor() {
        this.usernameInput = $(".usernameInput");
        this.passwordInput = $(".passwordInput");

        this.loginButton = $(".indexLoginButton");

        this.indexPassword = $(".indexPassword");

        this.playChecked = $(".indexPlayChecked");
        this.playChecked.click(() => {
            this.playIsChecked = !this.playIsChecked;
        })

        this.usernameInput.keyup((e) => {
            if(e.target.value.trim() === '') return;

            const username = e.target.value.trim();
            $(".indexPseudoIcon").css("background-image", `url(https://api.habbocity.me/avatar_image.php?user=${username}&headonly=1&head_direction=2)`);

            if (e.which === 13) {
                this.login();
            }
        });

        this.passwordInput.keypress((e) => {
            if (e.which === 13) {
                this.login();
            }
        });

        this.loginButton.click(() => this.login());

        this.indexPassword.click(() => {
            let popup = CompPopup.create(`${Config.url}/website/index/popup/password.php`, "32_warn_blue", "Mot de passe oublié", 315, 500, 'passwordLost');
        });
    }

    login() {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/index/action/ActionLogin.php`,
            data: {
                password: this.passwordInput.val(),
                username: this.usernameInput.val()
            },
            dataType: "json",
            success: (json) => {
                if (json.success) {
                    window.location.reload();
                } else {
                    CompNotification.create("Billy", json.response, undefined, undefined);
                }
            }
        });
    }
}