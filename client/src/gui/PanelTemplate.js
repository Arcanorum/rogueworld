
class PanelTemplate {
    /**
     * @param {HTMLElement} panelContainer - The top parent that this template will be build onto.
     * @param {Number} width - The width of the main container.
     * @param {Number} height - The height of the main container.
     * @param {String} panelName - The displayed name of the panel.
     * @param {String} panelIconURL - The url path relative to `assets/img/` to the source image to use for the icon.
     * @param {Boolean} [noCloseButton=true] - Should a close button be added to the top right. If not, uses a corner instead.
     */
    constructor (panelContainer, width, height, panelName, panelIconURL, noCloseButton) {

        // Is the panel currently open, visible, shown.
        this.isOpen = false;

        this.topContainer = panelContainer;
        this.topContainer.draggable = false;

        // The container that all the generic styling stuff is put in.
        this.mainContainer = document.createElement('div');
        this.mainContainer.className = 'panel_template_main_cont';
        this.mainContainer.style.width = width + "px";
        this.mainContainer.style.height = height + "px";
        this.mainContainer.draggable = false;
        this.topContainer.appendChild(this.mainContainer);

        // Add the top left icon border that gives a backing to the panel specific icon.
        const iconBorder = document.createElement('img');
        iconBorder.className = 'centered panel_template_icon_border';
        iconBorder.src = 'assets/img/gui/panels/panel_icon_border.png';
        iconBorder.draggable = false;
        this.mainContainer.appendChild(iconBorder);

        // Add the text with the thick stroke to be a backing for the panel name.
        this.nameBorder = document.createElement('div');
        this.nameBorder.className = 'panel_template_name_border';
        // Use spaces to add a bit of left offset.
        this.nameBorder.innerText = '\xa0\xa0' + panelName;
        this.mainContainer.appendChild(this.nameBorder);

        // Add the text with the thick stroke to be a backing for the panel name.
        this.name = document.createElement('div');
        this.name.className = 'panel_template_name';
        // Use spaces to add a bit of left offset.
        this.name.innerText = '\xa0\xa0' + panelName;
        this.mainContainer.appendChild(this.name);

        // Add the top left panel specific icon.
        this.icon = document.createElement('img');
        this.icon.className = 'centered panel_template_icon';
        this.icon.src = 'assets/img/' + panelIconURL + '.png';
        this.icon.draggable = false;
        this.mainContainer.appendChild(this.icon);

        if(noCloseButton === true){
            // Add a top right corner in place of the button.
            const topCorner = document.createElement('img');
            topCorner.className = 'centered panel_template_top_corner';
            topCorner.src = 'assets/img/gui/panels/panel_corner.png';
            topCorner.draggable = false;
            this.mainContainer.appendChild(topCorner);
        }
        else {
            // Add the close button.
            const closeButton = document.createElement('img');
            closeButton.className = 'centered panel_template_close_button';
            closeButton.src = 'assets/img/gui/panels/panel_close_button.png';
            closeButton.onclick = this.hide.bind(this);
            closeButton.draggable = false;
            this.mainContainer.appendChild(closeButton);
        }

        // Add the bottom corners.
        const leftCorner = document.createElement('img');
        leftCorner.className = 'centered panel_template_left_corner';
        leftCorner.src = 'assets/img/gui/panels/panel_corner.png';
        leftCorner.draggable = false;
        this.mainContainer.appendChild(leftCorner);

        const rightCorner = document.createElement('img');
        rightCorner.className = 'centered panel_template_right_corner';
        rightCorner.src = 'assets/img/gui/panels/panel_corner.png';
        rightCorner.draggable = false;
        this.mainContainer.appendChild(rightCorner);

        // Add the container for the other panel specific elements.
        this.contentsContainer = document.createElement('div');
        this.contentsContainer.className = 'panel_template_contents_cont';
        this.mainContainer.appendChild(this.contentsContainer);
    }

    /**
     * Make the panel visible.
     */
    show () {
        this.isOpen = true;
        // Show the panel.
        this.topContainer.style.visibility = "visible";

        _this.GUI.activePanel = this;
    }

    /**
     * Make the panel invisible.
     */
    hide () {
        this.isOpen = false;
        // Hide the panel.
        this.topContainer.style.visibility = "hidden";

        _this.GUI.activePanel = null;
    }

    /**
     * Change the top display name of this panel.
     * @param {String} newName
     */
    changeName (newName) {
        this.nameBorder.innerText = '\xa0\xa0' + newName;
        this.name.innerText = '\xa0\xa0' + newName;
    }

}

export default PanelTemplate