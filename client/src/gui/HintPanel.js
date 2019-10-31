
import PanelTemplate from "./PanelTemplate";

class HintPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('hint_panel'), 500, 400, 'Hint', 'gui/panels/hint-icon');

        const mainContainer = document.createElement('div');
        mainContainer.id = 'hint_main_cont';
        this.contentsContainer.appendChild(mainContainer);

        this.hintText = document.createElement('div');
        this.hintText.id = 'hint_text';
        this.hintText.innerText = 'this is some testing text to show how this thing works';
        mainContainer.appendChild(this.hintText);

        this.hintImage = document.createElement('img');
        this.hintImage.id = 'hint_image';
        mainContainer.appendChild(this.hintImage);

    }

    show (panelNameTextDefID, contentTextDefID, contentFileName) {
        if(panelNameTextDefID === undefined) this.changeName('');
        else this.changeName(dungeonz.getTextDef("Hint panel: " + panelNameTextDefID));

        if(contentTextDefID === undefined) this.hintText.style.display = "none";
        else {
            this.hintText.innerText = dungeonz.getTextDef(contentTextDefID);
            this.hintText.style.display = "block";
        }

        if(contentFileName === undefined) this.hintImage.style.display = "none";
        else {
            this.hintImage.src = 'assets/img/gui/panels/hint gifs/' + contentFileName;
            this.hintImage.style.display = "block";
        }

        super.show();
        _this.GUI.isAnyPanelOpen = true;
    }

    hide () {
        super.hide();

        this.hintText.style.display = "none";
        this.hintImage.style.display = "none";

        _this.GUI.isAnyPanelOpen = false;
    }

}

export default HintPanel;