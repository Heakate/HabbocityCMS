import {CompNotification} from "../../assets/comp/notification/comp-notification.js";

document.querySelectorAll('.indexGenderBubble').forEach(box =>
    box.addEventListener("click", (event) => {
        const genderLabels = document.querySelectorAll('.indexGenderBubble');

        genderLabels.forEach(label => {
            label.addEventListener('click', () => {
                genderLabels.forEach(l => l.classList.remove('active'));
                label.classList.add('active');
            });
        });
    })
);

document.querySelector(".indexRegisterButton").addEventListener("click", (event) => {
    event.preventDefault();

    let form = document.querySelector("#captchaForm");
    let formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error("Réponse JSON invalide :", text);
                throw new Error("Erreur dans la réponse du serveur.");
            }
        })
        .then((data) => {
            if (data.success) {
                CompNotification.create("Succès", data.response, undefined, undefined, true);
                window.location.href = "/verify";
            } else {
                CompNotification.create("Erreur", data.response, undefined, undefined, true);
            }
        })
        .catch((error) => {
            CompNotification.create("Erreur", "Une erreur inattendue est survenue.", undefined, undefined, true);
            console.log("Erreur détectée :", error);
        });
});