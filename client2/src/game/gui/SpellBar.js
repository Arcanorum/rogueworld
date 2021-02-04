import SpellBookTypes from "../../catalogues/SpellBookTypes.json";

class SpellSlot {
    constructor(spellBar, spellNumber) {
        const container = document.createElement("div");
        container.className = "spell_slot_cont";
        container.onclick = function () {
            spellBar.spellSelect(spellNumber);
        };
        container.onmouseover = spellBar.slotMouseOver;
        container.onmouseout = spellBar.slotMouseOut;
        container.setAttribute("spellNumber", spellNumber);
        document.getElementById("spell_slots_cont")
            .appendChild(container);

        this.icon = document.createElement("img");
        this.icon.className = "spell_slot_icon";
        this.icon.src = "assets/img/gui/spells/ward-spell-icon.png";
        container.appendChild(this.icon);

        this.border = document.createElement("img");
        this.border.className = "spell_slot_border";
        this.border.src = "assets/img/gui/hud/spell-slot-border-inactive.png";
        container.appendChild(this.border);
    }
}

class SpellBar {
    constructor() {
        // The whole thing.
        this.container = document.getElementById("spell_bar");
        this.tooltip = document.getElementById("spell_tooltip");
        this.spellName = document.getElementById("spell_tooltip_name");
        this.description = document.getElementById("spell_tooltip_description");

        // The number of which spell is selected.
        this.selectedSpellNumber = 1;

        // The spell book data of the held spell book.
        const SpellBookType = SpellBookTypes[1]; // compliance to eslint (prefer-destructuring)
        this.selectedSpellBook = SpellBookType;

        this.slots = {
            spell1: new SpellSlot(this, 1),
            spell2: new SpellSlot(this, 2),
            spell3: new SpellSlot(this, 3),
            spell4: new SpellSlot(this, 4),
        };
    }

    show() {
        window.gameScene.GUI.isAnyPanelOpen = true;
        this.container.style.visibility = "visible";
    }

    hide() {
        window.gameScene.GUI.isAnyPanelOpen = false;
        this.container.style.visibility = "hidden";
    }

    spellSelect(spellNumber) {
        this.selectedSpellNumber = spellNumber;

        // Un-highlight all other icons.
        Object.keys(this.slots)
            .forEach((key) => {
                this.slots[key].border.src = "assets/img/gui/hud/spell-slot-border-inactive.png";
            });
        // Make the given spell slot look selected.
        this.slots[`spell${
            spellNumber}`].border.src = "assets/img/gui/hud/spell-slot-border-active.png";

        // Tell the server that the selected spell of this spell book has changed.
        window.ws.sendEvent("spell_selected", this.selectedSpellNumber);
    }

    changeSpellBook(spellBookTypeNumber) {
        this.selectedSpellBook = SpellBookTypes[spellBookTypeNumber];

        // Update the spell icons.
        this.slots.spell1.icon.src = `assets/img/gui/spells/${
            this.selectedSpellBook.spell1IconSource}-spell-icon.png`;
        this.slots.spell2.icon.src = `assets/img/gui/spells/${
            this.selectedSpellBook.spell2IconSource}-spell-icon.png`;
        this.slots.spell3.icon.src = `assets/img/gui/spells/${
            this.selectedSpellBook.spell3IconSource}-spell-icon.png`;
        this.slots.spell4.icon.src = `assets/img/gui/spells/${
            this.selectedSpellBook.spell4IconSource}-spell-icon.png`;

        this.spellSelect(this.selectedSpellNumber);
    }

    slotMouseOver() {
        const spellNumber = this.getAttribute("spellNumber");
        const { spellBar } = window.gameScene.GUI;
        spellBar.tooltip.style.visibility = "visible";
        spellBar.spellName.innerText = window.dungeonz.getTextDef(
            `Spell name: ${spellBar.selectedSpellBook[`spell${spellNumber}IdName`]}`,
        );
        spellBar.description.innerText = window.dungeonz.getTextDef(
            `Spell description: ${spellBar.selectedSpellBook[`spell${spellNumber}IdName`]}`,
        );
    }

    slotMouseOut() {
        window.gameScene.GUI.spellBar.tooltip.style.visibility = "hidden";
    }
}

export default SpellBar;
