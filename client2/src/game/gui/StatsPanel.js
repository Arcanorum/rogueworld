import PanelTemplate from "./PanelTemplate";

class StatIcon {
    constructor(iconsContainer, iconFileName, onClickFunction) {
        const contCont = document.createElement("div");
        contCont.className = "stat_icon_cont_cont";
        iconsContainer.appendChild(contCont);

        this.container = document.createElement("div");
        this.container.className = "stat_icon_cont";
        this.container.onclick = onClickFunction;
        contCont.appendChild(this.container);

        this.icon = document.createElement("img");
        this.icon.className = "stat_icon";
        this.icon.src = `assets/img/gui/panels/${iconFileName}-icon.png`;
        this.container.appendChild(this.icon);
    }
}

class StatsPanel extends PanelTemplate {
    constructor() {
        super(document.getElementById("stats_panel"), 540, 380,
            window.dungeonz.getTextDef("Stats panel: name"), "gui/hud/stats-icon");

        // Which stat is currently selected.
        this.selectedStat = window.gameScene.player.stats.list.Melee;

        this.innerContainer = document.createElement("div");
        this.innerContainer.id = "stats_inner_cont";
        this.contentsContainer.appendChild(this.innerContainer);

        this.statIconsContainer = document.createElement("div");
        this.statIconsContainer.id = "stat_icons_cont";
        this.innerContainer.appendChild(this.statIconsContainer);

        const spacer = document.createElement("div");
        spacer.className = "panel_template_spacer";
        this.innerContainer.appendChild(spacer);

        this.statInfoContainer = document.createElement("div");
        this.statInfoContainer.id = "stat_info_cont";
        this.innerContainer.appendChild(this.statInfoContainer);

        this.statName = document.createElement("div");
        this.statName.id = "stat_name";
        this.statName.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statName);

        this.statDescription = document.createElement("div");
        this.statDescription.id = "stat_description";
        this.statDescription.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statDescription);

        this.statLevelCounter = document.createElement("div");
        this.statLevelCounter.id = "stat_level_counter";
        this.statLevelCounter.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statLevelCounter);

        this.statExpCounter = document.createElement("div");
        this.statExpCounter.id = "stat_exp_counter";
        this.statExpCounter.className = "stat_info_text";
        this.statInfoContainer.appendChild(this.statExpCounter);

        const statsPanel = this;
        const stats = window.gameScene.player.stats.list;

        this.icons = {
            Melee: new StatIcon(this.statIconsContainer, "melee", (() => {
                statsPanel.changeStatInfo(stats.Melee);
            })),
            Ranged: new StatIcon(this.statIconsContainer, "ranged", (() => {
                statsPanel.changeStatInfo(stats.Ranged);
            })),
            Magic: new StatIcon(this.statIconsContainer, "magic", (() => {
                statsPanel.changeStatInfo(stats.Magic);
            })),
            Gathering: new StatIcon(this.statIconsContainer, "gathering", (() => {
                statsPanel.changeStatInfo(stats.Gathering);
            })),
            Weaponry: new StatIcon(this.statIconsContainer, "weaponry", (() => {
                statsPanel.changeStatInfo(stats.Weaponry);
            })),
            Armoury: new StatIcon(this.statIconsContainer, "armoury", (() => {
                statsPanel.changeStatInfo(stats.Armoury);
            })),
            Toolery: new StatIcon(this.statIconsContainer, "toolery", (() => {
                statsPanel.changeStatInfo(stats.Toolery);
            })),
            Potionry: new StatIcon(this.statIconsContainer, "potionry", (() => {
                statsPanel.changeStatInfo(stats.Potionry);
            })),
            Clanship: new StatIcon(this.statIconsContainer, "clanship", (() => {
                statsPanel.changeStatInfo(stats.Clanship);
            })),
        };
    }

    updateSelectedStat() {
        this.changeStatInfo(this.selectedStat);
    }

    changeStatInfo(stat) {
        this.selectedStat = stat;

        // Un-highlight all other icons.
        Object.keys(this.icons).forEach((key) => {
            this.icons[key].container.style.backgroundColor = window.gameScene.GUI.GUIColours.taskSlotDefault;
        });

        this.icons[stat.name].container.style.backgroundColor = window.gameScene.GUI.GUIColours.taskSlotTracking;
        this.statName.innerText = window.dungeonz.getTextDef(`Stat name: ${stat.name}`);
        this.statDescription.innerText = window.dungeonz.getTextDef(`Stat description: ${stat.name}`);
        this.statLevelCounter.innerText = `${window.dungeonz.getTextDef("Level")}: ${stat.level}`;
        this.statExpCounter.innerText = `${window.dungeonz.getTextDef("Exp")}: ${stat.exp} / ${
            stat.nextLevelExpRequirement}`;
    }

    show() {
        super.show();
        window.gameScene.GUI.isAnyPanelOpen = true;
        this.updateSelectedStat();
    }

    hide() {
        super.hide();
        window.gameScene.GUI.isAnyPanelOpen = false;
    }
}

export default StatsPanel;
