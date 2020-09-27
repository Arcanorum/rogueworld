
import PanelTemplate from "./PanelTemplate";

class StatIcon {
    constructor(iconsContainer, iconFileName, onClickFunction) {
        const contCont = document.createElement('div');
        contCont.className = "stat_icon_cont_cont";
        iconsContainer.appendChild(contCont);

        this.container = document.createElement('div');
        this.container.className = "stat_icon_cont";
        this.container.onclick = onClickFunction;
        contCont.appendChild(this.container);

        this.icon = document.createElement('img');
        this.icon.className = "stat_icon";
        this.icon.src = "assets/img/gui/panels/" + iconFileName + "-icon.png";
        this.container.appendChild(this.icon);
    }
}

class StatsPanel extends PanelTemplate {
    constructor() {
        super(document.getElementById('stats_panel'), 540, 380, dungeonz.getTextDef('Stats panel: name'), 'gui/hud/stats-icon');

        // Which stat is currently selected.
        this.selectedStat = _this.player.stats.list.Melee;

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'stats_inner_cont';
        this.contentsContainer.appendChild(this.innerContainer);

        this.statIconsContainer = document.createElement('div');
        this.statIconsContainer.id = "stat_icons_cont";
        this.innerContainer.appendChild(this.statIconsContainer);

        const spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        this.innerContainer.appendChild(spacer);

        this.statInfoContainer = document.createElement('div');
        this.statInfoContainer.id = "stat_info_cont";
        this.innerContainer.appendChild(this.statInfoContainer);

        this.statName = document.createElement('div');
        this.statName.id = "stat_name";
        this.statName.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statName);

        this.statDescription = document.createElement('div');
        this.statDescription.id = "stat_description";
        this.statDescription.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statDescription);

        this.statLevelCounter = document.createElement('div');
        this.statLevelCounter.id = "stat_level_counter";
        this.statLevelCounter.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statLevelCounter);

        this.statExpCounter = document.createElement('div');
        this.statExpCounter.id = "stat_exp_counter";
        this.statExpCounter.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statExpCounter);

        const statsPanel = this;
        const stats = _this.player.stats.list;

        this.icons = {
            Melee: new StatIcon(this.statIconsContainer, 'melee', function () { statsPanel.changeStatInfo(stats.Melee) }),
            Ranged: new StatIcon(this.statIconsContainer, 'ranged', function () { statsPanel.changeStatInfo(stats.Ranged) }),
            Magic: new StatIcon(this.statIconsContainer, 'magic', function () { statsPanel.changeStatInfo(stats.Magic) }),
            Gathering: new StatIcon(this.statIconsContainer, 'gathering', function () { statsPanel.changeStatInfo(stats.Gathering) }),
            Weaponry: new StatIcon(this.statIconsContainer, 'weaponry', function () { statsPanel.changeStatInfo(stats.Weaponry) }),
            Armoury: new StatIcon(this.statIconsContainer, 'armoury', function () { statsPanel.changeStatInfo(stats.Armoury) }),
            Toolery: new StatIcon(this.statIconsContainer, 'toolery', function () { statsPanel.changeStatInfo(stats.Toolery) }),
            Potionry: new StatIcon(this.statIconsContainer, 'potionry', function () { statsPanel.changeStatInfo(stats.Potionry) }),
            Clanship: new StatIcon(this.statIconsContainer, 'clanship', function () { statsPanel.changeStatInfo(stats.Clanship) }),
        };
    }

    updateSelectedStat() {
        this.changeStatInfo(this.selectedStat);
    }

    changeStatInfo(stat) {
        this.selectedStat = stat;

        // Un-highlight all other icons.
        for (let key in this.icons) {
            if (this.icons.hasOwnProperty(key) === false) continue;
            this.icons[key].container.style.backgroundColor = _this.GUI.GUIColours.taskSlotDefault;
        }

        this.icons[stat.name].container.style.backgroundColor = _this.GUI.GUIColours.taskSlotTracking;
        this.statName.innerText = dungeonz.getTextDef("Stat name: " + stat.name);
        this.statDescription.innerText = dungeonz.getTextDef("Stat description: " + stat.name);
        this.statLevelCounter.innerText = dungeonz.getTextDef("Level") + ": " + stat.level;
        this.statExpCounter.innerText = dungeonz.getTextDef("Exp") + ": " + stat.exp + " / " + stat.nextLevelExpRequirement;
    }

    show() {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
        this.updateSelectedStat();
    }

    hide() {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

}

export default StatsPanel;