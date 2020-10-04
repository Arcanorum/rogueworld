export default (eventResponses) => {

    eventResponses.effect_start_burn = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onBurnStart();
    };

    eventResponses.effect_stop_burn = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onBurnStop();
    };

    eventResponses.effect_start_poison = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onPoisonStart();
    };

    eventResponses.effect_stop_poison = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onPoisonStop();
    };

    eventResponses.effect_start_health_regen = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onHealthRegenStart();
    };

    eventResponses.effect_stop_health_regen = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onHealthRegenStop();
    };

    eventResponses.effect_start_energy_regen = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onEnergyRegenStart();
    };

    eventResponses.effect_stop_energy_regen = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onEnergyRegenStop();
    };

    eventResponses.effect_start_cured = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onCuredStart();
    };

    eventResponses.effect_stop_cured = (data) => {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onCuredStop();
    };

    eventResponses.curse_set = (data) => {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.curseIcon.visible = true;
    };

    eventResponses.curse_removed = (data) => {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.curseIcon.visible = false;
    };

    eventResponses.enchantment_set = (data) => {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.enchantmentIcon.visible = true;
    };

    eventResponses.enchantment_removed = (data) => {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.enchantmentIcon.visible = false;
    };
};