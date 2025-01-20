import {io} from "../radio/socketio.min.js";

const server = "https://radio-server.funados.fr";
const apiUrl = `${server}/api`;
const artistElement = document.getElementById("artist");
const titleElement = document.getElementById("title");
const albumImageElement = document.getElementById("cover");

function truncateString(string, maxLength, ellipsis = '...') {
    if (string.length <= maxLength) {
        return string;
    } else {
        return string.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
}

function addMovingTextClass(text) {
    if (text.length > 16) {
        if (!titleElement.classList.contains("moving-text")) {
            titleElement.classList.add("moving-text");
        }
    } else {
        if (titleElement.classList.contains("moving-text")) {
            titleElement.classList.remove("moving-text");
        }
    }
    return text;
}

function addMovingTextClassArtist(text) {
    if (text.length > 15) {
        if (!artistElement.classList.contains("moving-text")) {
            artistElement.classList.add("moving-text");
        }
    } else {
        if (artistElement.classList.contains("moving-text")) {
            artistElement.classList.remove("moving-text");
        }
    }
    return text;
}


const updateMusic = async () => {
        try {
            const response = await fetch(`${apiUrl}/music`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                artistElement.textContent = addMovingTextClassArtist(data.artist);
                titleElement.textContent = addMovingTextClass(data.title);
                albumImageElement.style.backgroundImage = `url(${data.cover})`;

                if (data.type == "Stream") {
                    const radioBox = document.getElementById('radioBox');

                    if (!radioBox.classList.contains("animatedBorderRadio")) {
                        radioBox.classList.add('animatedBorderRadio');
                    }
                } else {
                    if (radioBox.classList.contains("animatedBorderRadio")) {
                        radioBox.classList.remove('animatedBorderRadio');
                    }
                }


            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la musique:", error);
            artistElement.textContent = "FunAdos";
            titleElement.textContent = "Info de retour très vite";
        }
    }
;
const socket = io(server);
socket.on("connect", () => {
        updateMusic();
    }
);
socket.on("disconnect", () => {
    }
);
socket.on("error", (error) => {
        console.error("Erreur WebSocket:", error);
    }
);
socket.on("initData", (data) => {
        artistElement.textContent = addMovingTextClassArtist(data.artist);
        titleElement.textContent = addMovingTextClass(data.title);
        albumImageElement.style.backgroundImage = `url(${data.cover})`;

        if (data.type == "Stream") {
            const radioBox = document.getElementById('radioBox');

            if (!radioBox.classList.contains("animatedBorderRadio")) {
                radioBox.classList.add('animatedBorderRadio');
            }
        } else {
            if (radioBox.classList.contains("animatedBorderRadio")) {
                radioBox.classList.remove('animatedBorderRadio');
            }
        }
    }
);
socket.on("musicChange", (data) => {
        artistElement.textContent = addMovingTextClassArtist(data.artist);
        titleElement.textContent = addMovingTextClass(data.title);
        albumImageElement.style.backgroundImage = `url(${data.cover})`;

        if (data.type == "Stream") {
            const radioBox = document.getElementById('radioBox');

            if (!radioBox.classList.contains("animatedBorderRadio")) {
                radioBox.classList.add('animatedBorderRadio');
            }
        } else {
            if (radioBox.classList.contains("animatedBorderRadio")) {
                radioBox.classList.remove('animatedBorderRadio');
            }
        }
    }
);
socket.on("informationChange", (data) => {
    }
);
const radio = document.getElementById('player');
var radioStreamUrl = null;
var delay = null;
var radioVolumeTemp = null;

function audioStart() {
    if (typeof com_adswizz_synchro_decorateUrl === "undefined") {
        radioStreamUrl = "https://funados.ice.infomaniak.ch/funados.mp3?aw_0_req.gdpr=true";
        radio.src = radioStreamUrl;
    } else {
        radioStreamUrl = window.adswizzSDK.decorateURL("https://funados.ice.infomaniak.ch/funados.mp3?aw_0_req.gdpr=true");
        radio.src = radioStreamUrl;
    }
}


const channel = new BroadcastChannel('radio-player');

channel.postMessage({status: 'ping'});

channel.onmessage = function (event) {
    if (event.data.status === 'playing') {
        stopRadioTemp();
    } else if (event.data.request === 'check-status') {
        if (!radio.muted) {
            channel.postMessage({status: 'playing'});
        }
    }
};


function setCookie(cname, cvalue) {
    var d = new Date()
    d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000)
    var expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";")
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

audioStart();
document.addEventListener('DOMContentLoaded', function () {
    function awaitClick() {
        document.addEventListener('click', function playOnClick() {
            document.removeEventListener('click', playOnClick);
            audioStart();
            playerRadio();
        });
    }

    function tryPlay() {
        radio.play().then(() => {
                playerRadio();
            }
        ).catch((error) => {
                radio.src = '';
                awaitClick();
            }
        );
    }

    tryPlay();
});
var controlsBtn = document.querySelector('.controls__btn');
var plusButton = document.getElementById('plusRadio');
var moinsButton = document.getElementById('moinsRadio');
var dediRadio = document.getElementById('dediRadio');
var rollRadio = document.getElementById('rollRadio');
var menuRadio = document.getElementById('menuRadio');
var titleMenuRadio = document.getElementById('titrageRadio');
var svgElement = document.getElementById('svgRollRadio');
var svgElementPower = document.getElementById('svgPowerRadio');
var volume = localStorage.getItem('isRadioVolume');
var iconPlay = '<svg id="svgPowerRadio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
var iconPause = '<svg id="svgPowerRadio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';
if (volume !== null) {
    radio.volume = parseFloat(volume);
}

function playRadio() {
    localStorage.setItem('isRadioPlaying', 'true');
    controlsBtn.classList.remove('controls--on');
    controlsBtn.classList.add('controls--off');
    controlsBtn.setAttribute('data-status', 'on');
    controlsBtn.style.borderBottom = '0';
    radio.muted = false;
    svgElementPower.innerHTML = iconPause;
    setCookie("radioState", 1)
}

function stopRadio() {
    setTimeout(function () {
        if (radio.muted == true) {
            radio.src = '';
            audioStart();
            radio.load();
            radio.play();
        }
    }, 1500);
    var updateVolume = getCookie("volume");
    radio.volume = updateVolume && updateVolume !== undefined ? updateVolume : 0.1;
    radio.muted = true;
    controlsBtn.classList.remove('controls--off');
    localStorage.setItem('isRadioPlaying', 'false');
    controlsBtn.classList.add('controls--on');
    controlsBtn.setAttribute('data-status', 'off');
    controlsBtn.style.borderBottom = '';
    svgElementPower.innerHTML = iconPlay;
    setCookie("radioState", 0)
}

function stopRadioTemp() {
    setTimeout(function () {
        if (radio.muted == true) {
            radio.src = '';
            audioStart();
            radio.load();
            radio.play();
        }
    }, 1500);
    var updateVolume = getCookie("volume");
    radio.volume = updateVolume && updateVolume !== undefined ? updateVolume : 0.1;
    radio.muted = true;
    controlsBtn.classList.remove('controls--off');
    controlsBtn.classList.add('controls--on');
    controlsBtn.setAttribute('data-status', 'off');
    controlsBtn.style.borderBottom = '';
    svgElementPower.innerHTML = iconPlay;
}

function closeMenu() {
    menuRadio.style.display = 'none';
    titleMenuRadio.style.display = 'none';
    var newSvgContent = '<svg id="svgRollRadio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';
    svgElement.innerHTML = newSvgContent;
    setCookie("radioMenu", -1)
    console.log("close title received");
}

function openTitle() {
    menuRadio.style.display = 'none';
    titleMenuRadio.style.display = 'block';
    var newSvgContent = '<svg id="svgRollRadio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';
    svgElement.innerHTML = newSvgContent;
    setCookie("radioMenu", 0)
    console.log("open title received");
}

function openMenu() {
    menuRadio.style.display = 'flex';
    titleMenuRadio.style.display = 'block';
    var newSvgContent = '<svg id="svgRollRadio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>';
    svgElement.innerHTML = newSvgContent;
    setCookie("radioMenu", 1)
    console.log("open menu received");
}

const initialMenu = getCookie("radioMenu");
if (initialMenu) {
    if (initialMenu == 1) {
        openMenu();
    } else if (initialMenu == -1) {
        closeMenu();
    } else {
        openTitle();
    }
} else {
    openTitle();
}

function playerRadio() {
    radio.load();
    radio.play();
}

const initialVolume = getCookie("volume");
radio.volume = initialVolume && initialVolume !== undefined ? initialVolume : 0.1
const initialState = getCookie("radioState");
if (initialState && initialState == 0) {
    stopRadio();
} else {
    playRadio();
    channel.postMessage({request: 'check-status'});
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function refreshStream() {
    if (radio.muted == true) {
        stopRadio();
    }
    delay = ((90 + getRandomInt(60)) * 1000);
    setTimeout(refreshStream, delay);
}

var delayInit = ((90 + getRandomInt(60)) * 1000);
setTimeout(refreshStream, delayInit);
controlsBtn.addEventListener('click', function () {
    if (radio.muted) {
        playRadio();
        channel.postMessage({status: 'playing'});
    } else {
        stopRadio();
    }
});
plusButton.addEventListener('click', function () {
    radioVolumeTemp = radio.volume;
    if (radioVolumeTemp < 0.15) {
        radioVolumeTemp += 0.02;
    } else {
        radioVolumeTemp += 0.05;
    }
    if (radioVolumeTemp > 1) {
        radioVolumeTemp = 1;
    } else if (radioVolumeTemp < 0) {
        radioVolumeTemp = 0
    }
    radio.volume = radioVolumeTemp;
    if (radio.volume > 1) {
        radio.volume = 1;
        setCookie("volume", radio.volume)
    } else {
        setCookie("volume", radio.volume)
    }
});
moinsButton.addEventListener('click', function () {
    var radioVolumeTemp = radio.volume;
    if (radioVolumeTemp < 0.15) {
        radioVolumeTemp -= 0.02;
    } else {
        radioVolumeTemp -= 0.05;
    }
    if (radioVolumeTemp > 1) {
        radioVolumeTemp = 1;
    } else if (radioVolumeTemp < 0) {
        radioVolumeTemp = 0
    }
    radio.volume = radioVolumeTemp;
    if (radio.volume < 0) {
        radio.volume = 0;
        setCookie("volume", radio.volume)
    } else {
        setCookie("volume", radio.volume)
    }
});
dediRadio.addEventListener('click', function () {
    window.open('https://funados-radio.fr/dedicace/', '_blank', 'width=500,height=370');
});
mmRadio.addEventListener('click', function () {
    window.open('https://mymusic.funados.fr/', '_blank');
});
rollRadio.addEventListener('click', function () {
    if ((menuRadio.style.display === 'none') && (titleMenuRadio.style.display === 'none')) {
        openTitle();
    } else if ((menuRadio.style.display === 'none') && (titleMenuRadio.style.display === 'block')) {
        openMenu();
    } else if ((menuRadio.style.display === 'flex') && (titleMenuRadio.style.display === 'block')) {
        closeMenu();
    }
});


dragElement(document.getElementById('radioBox'));

function dragElement(elmnt) {

    window.addEventListener('resize', function () {
        setTimeout(function () {
            if (!isElementInViewport(elmnt)) {
                elmnt.style.top = "";
                elmnt.style.left = "";
            }
        }, 10);
    });


    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var isDragging = false;

    if (document.getElementById("draggerRadio")) {
        document.getElementById("draggerRadio").addEventListener('mousedown', dragMouseDown);
    } else {
        elmnt.addEventListener('mousedown', dragMouseDown);
    }

    function dragMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.querySelector('iframe').style.pointerEvents = 'none';

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function elementDrag(e) {
        e.preventDefault();
        if (isDragging) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            var newTop = elmnt.offsetTop - pos2;
            var newLeft = elmnt.offsetLeft - pos1;

            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            var elemWidth = elmnt.offsetWidth;
            var elemHeight = elmnt.offsetHeight;

            var parentOffset = elmnt.offsetParent.getBoundingClientRect();

            if (newTop < -parentOffset.top) {
                newTop = -parentOffset.top;
            } else if (newTop + elemHeight > windowHeight - parentOffset.top) {
                newTop = windowHeight - elemHeight - parentOffset.top;
            }

            if (newLeft < -parentOffset.left) {
                newLeft = -parentOffset.left;
            } else if (newLeft + elemWidth > windowWidth - parentOffset.left) {
                newLeft = windowWidth - elemWidth - parentOffset.left;
            }

            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";

            setCookie('radioPosition', JSON.stringify({
                top: elmnt.style.top,
                left: elmnt.style.left
            }));
        }
    }

    function closeDragElement() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            document.querySelector('iframe').style.pointerEvents = 'auto';
        }
    }

    function isElementInViewport(elmnt) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var rect = elmnt.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= windowWidth
        );
    }

    window.onload = function () {
        var radioPosition = getCookie('radioPosition');
        if (radioPosition) {
            var pos = JSON.parse(radioPosition);
            elmnt.style.top = pos.top;
            elmnt.style.left = pos.left;

            setTimeout(function () {
                if (!isElementInViewport(elmnt)) {
                    elmnt.style.top = "";
                    elmnt.style.left = "";
                }
            }, 10);
        }
    }
}