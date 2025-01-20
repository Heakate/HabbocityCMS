import { Config } from "../../../app/configs/config.js";
import { CompNotification } from "../../../assets/comp/notification/comp-notification.js";

export class Password {
    module;

    emailInput;
    codeReceivedInput;
    passwordInput;
    passwordConfirmationInput;

    nextButton;
    endButton;

    constructor() {
        this.module = $(".password").last();

        // Initialisation des champs
        this.emailInput = this.module.find(".email");
        this.codeReceivedInput = this.module.find(".codeReceived");
        this.passwordInput = this.module.find(".newPassword");
        this.passwordConfirmationInput = this.module.find(".newPasswordConfirmation");

        // Initialisation des boutons
        this.nextButton = this.module.find(".nextButton");
        this.endButton = this.module.find(".endButton");

        // Ajout des événements aux boutons
        this.nextButton.click(() => {
            this.sendCode();
        });

        this.endButton.click(() => {
            this.changePassword();
        });
    }

    sendCode() {
        $.ajax({
            type: "POST",
            url: `${Config.url}/website/index/action/ActionPasswordGive.php`,
            data: {
                step: 1,
                email: this.emailInput.val()
            },
            dataType: "json",
            success: (json) => {
                console.log(json);
                if (json.success) {
                    CompNotification.create("Billy", json.message || "Un code a été envoyé à ton adresse e-mail.", undefined, undefined);
                } else {
                    const message = json.message || "Une erreur est survenue";
                    CompNotification.create("Billy", message, undefined, undefined);
                }
            },
            error: (xhr, status, error) => {
                CompNotification.create("Billy", "Une erreur s'est produite lors de la demande de code. Réessaie.", undefined, undefined);
            }
        });
    }
    changePassword() {

        $.ajax({
            type: "POST",
            url: `${Config.url}/website/index/action/ActionPasswordCheck.php`,
            data: {
                step: 2,
                email: this.emailInput.val(),
                code: this.codeReceivedInput.val(),
                password: this.passwordInput.val(),
                repassword: this.passwordConfirmationInput.val()
            },
            dataType: "json",
            success: (json) => {
                console.log(json);
                if (json.success) {
                    CompNotification.create("Billy", json.response || "Ton mot de passe a été mis à jour avec succès.", undefined, undefined);
                    window.location.reload();
                } else {
                    const response = json.response || "Une erreur est survenue";
                    CompNotification.create("Billy", response, undefined, undefined);
                }
            },
            error: (xhr, status, error) => {
                CompNotification.create("Billy", "Une erreur s'est produite lors de la mise à jour du mot de passe. Réessaie.", undefined, undefined);
            }
        });
    }
}

new Password();