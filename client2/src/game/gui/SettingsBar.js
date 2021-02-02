class SettingsBar {
    constructor() {
        const settingsBar = this;

        this.settingsIcon = document.getElementById("settings_icon");
        this.audioIcon = document.getElementById("audio_icon");
        this.audioMinusIcon = document.getElementById("audio_minus_icon");
        this.audioPlusIcon = document.getElementById("audio_plus_icon");
        this.audioCounter = document.getElementById("audio_counter");
        this.guiZoomIcon = document.getElementById("gui_zoom_icon");
        this.guiZoomMinusIcon = document.getElementById("gui_zoom_minus_icon");
        this.guiZoomPlusIcon = document.getElementById("gui_zoom_plus_icon");
        this.guiZoomCounter = document.getElementById("gui_zoom_counter");
        this.virtualDPadIcon = document.getElementById("virtual_dpad_icon");
        this.fullscreenIcon = document.getElementById("fullscreen_icon");

        this.settingsTooltip = document.getElementById("settings_tooltip");
        this.audioTooltip = document.getElementById("audio_tooltip");
        this.guiZoomTooltip = document.getElementById("gui_zoom_tooltip");
        this.virtualDPadTooltip = document.getElementById("virtual_dpad_tooltip");
        this.fullscreenTooltip = document.getElementById("fullscreen_tooltip");

        this.settingsIcon.onmouseover = function () {
            settingsBar.settingsTooltip.style.visibility = "visible";
        };
        this.settingsIcon.onmouseout = function () {
            settingsBar.settingsTooltip.style.visibility = "hidden";
        };
        this.settingsIcon.onclick = function () {
            if (settingsBar.settingsIcon.style.opacity === "0.5") {
                settingsBar.hide();
            }
            else {
                settingsBar.show();
            }
        };

        this.audioIcon.onmouseover = function () {
            settingsBar.audioTooltip.style.visibility = "visible";
        };
        this.audioIcon.onmouseout = function () {
            settingsBar.audioTooltip.style.visibility = "hidden";
        };
        this.audioIcon.onclick = function () {
            if (window.dungeonz.audioEnabled === true) {
                window.window.dungeonz.audioEnabled = false;
                settingsBar.audioCounter.innerText = "0%";
                settingsBar.audioIcon.style.opacity = "0.5";
                settingsBar.audioCounter.style.opacity = "0.5";
                settingsBar.audioMinusIcon.style.opacity = "0.5";
                settingsBar.audioPlusIcon.style.opacity = "0.5";
            }
            else {
                window.window.dungeonz.audioEnabled = true;
                settingsBar.audioCounter.innerText = `${window.dungeonz.audioLevel}%`;
                settingsBar.audioIcon.style.opacity = "1";
                settingsBar.audioCounter.style.opacity = "1";
                settingsBar.audioMinusIcon.style.opacity = "1";
                settingsBar.audioPlusIcon.style.opacity = "1";
            }
        };

        this.audioMinusIcon.onclick = function () {
            // Don't go below 0 volume.
            if (window.dungeonz.audioLevel <= 0) return;

            window.window.dungeonz.audioLevel -= 10;
            window.window.dungeonz.audioEnabled = true;
            settingsBar.audioCounter.innerText = `${window.dungeonz.audioLevel}%`;
            settingsBar.audioIcon.style.opacity = "1";
            settingsBar.audioCounter.style.opacity = "1";
            settingsBar.audioMinusIcon.style.opacity = "1";
            settingsBar.audioPlusIcon.style.opacity = "1";
        };

        this.audioPlusIcon.onclick = function () {
            // Don't go above 1 volume.
            if (window.dungeonz.audioLevel >= 100) return;

            window.window.dungeonz.audioLevel += 10;
            window.window.dungeonz.audioEnabled = true;
            settingsBar.audioCounter.innerText = `${window.dungeonz.audioLevel}%`;
            settingsBar.audioIcon.style.opacity = "1";
            settingsBar.audioCounter.style.opacity = "1";
            settingsBar.audioMinusIcon.style.opacity = "1";
            settingsBar.audioPlusIcon.style.opacity = "1";
        };

        this.guiZoomIcon.onmouseover = function () {
            settingsBar.guiZoomTooltip.style.visibility = "visible";
        };
        this.guiZoomIcon.onmouseout = function () {
            settingsBar.guiZoomTooltip.style.visibility = "hidden";
        };

        const getStyle = function (className) {
            const classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
            for (let x = 0; x < classes.length; x++) {
                if (classes[x].selectorText === className) {
                    return classes[x].style;
                }
            }
        };

        this.guiZoomMinusIcon.onclick = function () {
            // Don't go below 10 zoom.
            if (window.dungeonz.GUIZoom <= 10) return;

            window.window.dungeonz.GUIZoom -= 10;
            settingsBar.guiZoomCounter.innerText = `${window.dungeonz.GUIZoom}%`;

            const style = getStyle(".gui_zoomable");
            style.zoom = window.window.dungeonz.GUIZoom / 100;
            style["-moz-transform"] = `scale(${window.dungeonz.GUIZoom / 100})`;
        };

        this.guiZoomPlusIcon.onclick = function () {
            // Don't go above 400 zoom.
            if (window.dungeonz.GUIZoom >= 400) return;

            window.window.dungeonz.GUIZoom += 10;
            settingsBar.guiZoomCounter.innerText = `${window.dungeonz.GUIZoom}%`;

            const style = getStyle(".gui_zoomable");
            style.zoom = window.window.dungeonz.GUIZoom / 100;
            style["-moz-transform"] = `scale(${window.dungeonz.GUIZoom / 100})`;
        };

        this.virtualDPadIcon.onmouseover = function () {
            settingsBar.virtualDPadTooltip.style.visibility = "visible";
        };
        this.virtualDPadIcon.onmouseout = function () {
            settingsBar.virtualDPadTooltip.style.visibility = "hidden";
        };
        this.virtualDPadIcon.onclick = function () {
            if (window.dungeonz.virtualDPadEnabled === true) {
                window.window.dungeonz.virtualDPadEnabled = false;
                window.gameScene.GUI.virtualDPad.style.visibility = "hidden";
                settingsBar.virtualDPadIcon.style.opacity = "0.5";
            }
            else {
                window.window.dungeonz.virtualDPadEnabled = true;
                window.gameScene.GUI.virtualDPad.style.visibility = "visible";
                settingsBar.virtualDPadIcon.style.opacity = "1";
            }
        };

        this.fullscreenIcon.onmouseover = function () {
            settingsBar.fullscreenTooltip.style.visibility = "visible";
        };
        this.fullscreenIcon.onmouseout = function () {
            settingsBar.fullscreenTooltip.style.visibility = "hidden";
        };
        this.fullscreenIcon.onclick = function () {
            if (window.gameScene.scale.isFullscreen === true) {
                window.gameScene.scale.stopFullscreen();
                settingsBar.fullscreenIcon.style.opacity = "0.5";
            }
            else {
                window.gameScene.scale.startFullscreen();
                settingsBar.fullscreenIcon.style.opacity = "1";
            }
        };

        this.audioCounter.innerText = `${window.dungeonz.audioLevel}%`;
        this.guiZoomCounter.innerText = `${window.dungeonz.GUIZoom}%`;

        this.hide();
    }

    show() {
        this.settingsIcon.style.opacity = "0.5";
        this.audioIcon.style.visibility = "visible";
        this.audioMinusIcon.style.visibility = "visible";
        this.audioPlusIcon.style.visibility = "visible";
        this.audioCounter.style.visibility = "visible";
        this.guiZoomIcon.style.visibility = "visible";
        this.guiZoomMinusIcon.style.visibility = "visible";
        this.guiZoomPlusIcon.style.visibility = "visible";
        this.guiZoomCounter.style.visibility = "visible";
        this.virtualDPadIcon.style.visibility = "visible";
        this.fullscreenIcon.style.visibility = "visible";
    }

    hide() {
        this.settingsIcon.style.opacity = "1";
        this.audioIcon.style.visibility = "hidden";
        this.audioMinusIcon.style.visibility = "hidden";
        this.audioPlusIcon.style.visibility = "hidden";
        this.audioCounter.style.visibility = "hidden";
        this.guiZoomIcon.style.visibility = "hidden";
        this.guiZoomMinusIcon.style.visibility = "hidden";
        this.guiZoomPlusIcon.style.visibility = "hidden";
        this.guiZoomCounter.style.visibility = "hidden";
        this.virtualDPadIcon.style.visibility = "hidden";
        this.fullscreenIcon.style.visibility = "hidden";
    }
}

export default SettingsBar;
