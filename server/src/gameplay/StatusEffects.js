// const Utils = require("../Utils");
const EventsList = require("../EventsList");
const Damage = require("./Damage");
const Heal = require("./Heal");

const StatusEffects = {};

class StatusEffect {
    /**
     *
     * @param {Character} entity
     * @param {*} source
     */
    constructor(entity, source) {
        this.appliedTo = entity;
        this.source = source || null;
        this.effectName = this.constructor.name;

        this.start();
    }

    start() {
        if (this.shouldStart() === false) {
            return;
        }

        if (this.appliedTo.hitPoints < 1) return;
        // Check if this kind of status effect is already active on this entity.
        if (this.appliedTo.statusEffects[this.effectName]) {
            // Reset the time remaining.
            this.appliedTo.statusEffects[this.effectName]._effectsRemaining = (
                this._startingEffectsRemaining
            );
            return;
        }
        // Add this new status effect.
        this.appliedTo.statusEffects[this.effectName] = this;

        // Tell nearby players the effect has been applied.
        this.appliedTo.board.emitToNearbyPlayers(
            this.appliedTo.row,
            this.appliedTo.col,
            this._startEffectEventName,
            this.appliedTo.id,
        );

        // Set the duration to be the default for new effects.
        this._effectsRemaining = this._startingEffectsRemaining;
        // If the effect should activate right away, do the effect.
        if (this._effectOnStart === true) {
            this._effect();
            // Check again if the applicant is now dead, might have been killed be the above effect.
            if (this.appliedTo.hitPoints < 1) return;
        }
        // Clear the existing effect loop, or the loops will be stacked (and
        // there won't be a reference to the stacked ones to stop them manually).
        clearTimeout(this._effectLoop);
        // Start the effect loop.
        this.addEffectTimeout();
    }

    addEffectTimeout() {
        this._effectLoop = setTimeout(this._effect.bind(this), this._effectRate);
    }

    _effect() {
        if (!this.appliedTo.board || !this.shouldContinueEffect()) {
            this.stop();
            return;
        }
        // If this effect damages what it is applied to, damage them.
        if (this._effectDamageAmount) {
            this.appliedTo.damage(
                new Damage({
                    amount: this._effectDamageAmount,
                    types: this._effectDamageTypes,
                    armourPiercing: this._effectDamageArmourPiercing,
                }),
                this.source,
            );
            // Stop this effect if the thing it is applied to died from the damage above.
            if (this.appliedTo.hitPoints < 1) {
                this.stop();
                return;
            }
        }
        // Or if this effect heals what it is applied to, heal them.
        else if (this._healAmount) {
            this.appliedTo.heal(
                new Heal(this._healAmount),
            );
        }
        this._effectsRemaining -= 1;
        // Check if the effect duration is over.
        if (this._effectsRemaining < 1) {
            if (this.shouldStop() === true) {
                this.stop();
                return;
            }
        }
        // Keep going with the effect loop.
        this.addEffectTimeout();
    }

    stop() {
        this._effectsRemaining = 0;
        // Stop the loop.
        clearTimeout(this._effectLoop);
        // Remove this effect from the thing it is applied to.
        delete this.appliedTo.statusEffects[this.effectName];
        // Don't send if they are already dead.
        if (this.appliedTo.hitPoints > 0) {
            this.appliedTo.board.emitToNearbyPlayers(
                this.appliedTo.row,
                this.appliedTo.col,
                this._stopEffectEventName,
                this.appliedTo.id,
            );
        }
    }

    shouldStart() {
        return true;
    }

    shouldStop() {
        return true;
    }

    shouldContinueEffect() {
        return true;
    }

    onMove() {
        if (!this.appliedTo.board) {
            this.stop();
            return;
        }
        // If this effect damages what it is applied to, damage them.
        if (this._moveDamageAmount) {
            this.appliedTo.damage(
                new Damage({
                    amount: this._moveDamageAmount,
                    types: this._moveDamageTypes,
                    armourPiercing: this._moveDamageArmourPiercing,
                }),
                this.source,
            );
            // Stop this effect if the thing it is applied to died from the damage above.
            if (this.appliedTo.hitPoints < 1) {
                this.stop();
            }
        }
        // Or if this effect heals what it is applied to, heal them.
        else if (this._healAmount) {
            this.appliedTo.heal(
                new Heal(this._healAmount),
            );
        }
    }
}
/** @type {String} The name of this effect, to be used as an ID in any lists of status effects. */
StatusEffect.prototype.effectName = "";
/** @type {Boolean} Should the effect by activated on start. */
StatusEffect.prototype._effectOnStart = false;
/** @type {Number} How much to modify the hitpoints of the thing it is applied to by each effect. */
StatusEffect.prototype._effectDamageAmount = 0;
/** @type {Array.<Number>} The types of damage to deal. A list of Damage.Types */
StatusEffect.prototype._effectDamageTypes = [];
/** @type {Number} How much armour this damage will ignore. 0 to 1. */
StatusEffect.prototype._effectDamageArmourPiercing = 0;
/** @type {Number} How much hitpoints to restore */
StatusEffect.prototype._healAmount = 0;
StatusEffect.prototype._moveDamageAmount = 0;
StatusEffect.prototype._moveDamageTypes = [];
StatusEffect.prototype._moveDamageArmourPiercing = 0;
/** @type {Number} How many more times will this effect happen before stopping. */
StatusEffect.prototype._effectsRemaining = 0;
/** @type {Number} How long will this effect last for when started. Starting the effect multiple times does not stack this duration. */
StatusEffect.prototype._startingEffectsRemaining = 0;
/** @type {Number} A reference to the loop of this effect. Counts down the remaining duration, and is used to stop and thus remove this status effect. */
StatusEffect.prototype._effectLoop = 0;
/** @type {Number} How long between each time the effect will be activated. */
StatusEffect.prototype._effectRate = 1000;
/** @type {String} The event name that will be sent when the effect starts. */
StatusEffect.prototype._startEffectEventName = "";
/** @type {String} The event name that will be sent when the effect stops. */
StatusEffect.prototype._stopEffectEventName = "";
/** @type {Boolean} Whether this status effect does something bad. */
StatusEffect.prototype.hazardous = false;
/** @type {Number} How much to modify the move rate of the entity this is applied to. >1 increase move rate, <1 decrease move rate. Cumulative. */
StatusEffect.prototype.moveRateModifier = 1;

class Burn extends StatusEffect {
    shouldContinueEffect() {
        // If it is water, remove burning if it is applied.
        // Can't walk into deep water.
        if (this.appliedTo.getBoardTile().groundType === GroundTypes.ShallowWater) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing in lava.
        // If so, keep burning.
        if (this.appliedTo.getBoardTile().groundType.StatusEffect === Burn) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}
const burnDamageConfig = require("./ModHitPointConfigs").Burn;

Burn.prototype._effectOnStart = true;
Burn.prototype._effectDamageAmount = burnDamageConfig.damageAmount;
Burn.prototype._effectDamageTypes = burnDamageConfig.damageTypes;
Burn.prototype._effectDamageArmourPiercing = burnDamageConfig.damageArmourPiercing;
Burn.prototype._startingEffectsRemaining = 3;
Burn.prototype._startEffectEventName = EventsList.effect_start_burn;
Burn.prototype._stopEffectEventName = EventsList.effect_stop_burn;
Burn.prototype.hazardous = true;
StatusEffects.Burn = Burn;

class Poison extends StatusEffect {
    shouldStart() {
        // If the target is cured, don't apply the poison effect.
        if (this.appliedTo.statusEffects[StatusEffects.Cured.name]) {
            return false;
        }

        return true;
    }

    shouldContinueEffect() {
        // If the target is cured, stop the poison effect.
        if (this.appliedTo.statusEffects[StatusEffects.Cured.name]) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing in poison.
        // If so, keep poisoned.
        if (this.appliedTo.getBoardTile().groundType.StatusEffect === Poison) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}
const poisonDamageConfig = require("./ModHitPointConfigs").Poison;

Poison.prototype._effectDamageAmount = poisonDamageConfig.damageAmount;
Poison.prototype._effectDamageTypes = poisonDamageConfig.damageTypes;
Poison.prototype._effectDamageArmourPiercing = poisonDamageConfig.damageArmourPiercing;
Poison.prototype._startingEffectsRemaining = 5;
Poison.prototype._effectRate = 2000;
Poison.prototype._startEffectEventName = EventsList.effect_start_poison;
Poison.prototype._stopEffectEventName = EventsList.effect_stop_poison;
Poison.prototype.hazardous = true;
StatusEffects.Poison = Poison;

class Disease extends StatusEffect { }
const diseaseDamageConfig = require("./ModHitPointConfigs").Disease;

Disease.prototype._effectDamageAmount = diseaseDamageConfig.damageAmount;
Disease.prototype._effectDamageTypes = diseaseDamageConfig.damageTypes;
Disease.prototype._effectDamageArmourPiercing = diseaseDamageConfig.damageArmourPiercing;
Disease.prototype._startingEffectsRemaining = 20;
Disease.prototype._effectRate = 4000;
Disease.prototype._startEffectEventName = EventsList.effect_start_disease;
Disease.prototype._stopEffectEventName = EventsList.effect_stop_disease;
Disease.prototype.hazardous = true;
StatusEffects.Disease = Disease;

class HealthRegen extends StatusEffect { }
HealthRegen.prototype._healAmount = require("./ModHitPointConfigs").HealthRegen.healAmount;

HealthRegen.prototype._startingEffectsRemaining = 5;
HealthRegen.prototype._startEffectEventName = EventsList.effect_start_health_regen;
HealthRegen.prototype._stopEffectEventName = EventsList.effect_stop_health_regen;
StatusEffects.HealthRegen = HealthRegen;

class EnergyRegen extends StatusEffect {
    _effect() {
        if (this.appliedTo.modEnergy) {
            this.appliedTo.modEnergy(1);
        }
        super._effect();
    }
}
EnergyRegen.prototype._startingEffectsRemaining = 10;
EnergyRegen.prototype._startEffectEventName = EventsList.effect_start_energy_regen;
EnergyRegen.prototype._stopEffectEventName = EventsList.effect_stop_energy_regen;
StatusEffects.EnergyRegen = EnergyRegen;

class Cured extends StatusEffect { }
Cured.prototype._effectOnStart = true;
Cured.prototype._startingEffectsRemaining = 60;
Cured.prototype._startEffectEventName = EventsList.effect_start_cured;
Cured.prototype._stopEffectEventName = EventsList.effect_stop_cured;
StatusEffects.Cured = Cured;

class ColdResistance extends StatusEffect { }
ColdResistance.prototype._effectOnStart = true;
ColdResistance.prototype._startingEffectsRemaining = 60;
ColdResistance.prototype._startEffectEventName = EventsList.effect_start_cold_resistance;
ColdResistance.prototype._stopEffectEventName = EventsList.effect_stop_cold_resistance;
StatusEffects.ColdResistance = ColdResistance;

class Chill extends StatusEffect {
    shouldStart() {
        // If the target has cold resistance, don't apply the chill effect.
        if (this.appliedTo.statusEffects[StatusEffects.ColdResistance.name]) {
            return false;
        }

        return true;
    }

    shouldContinueEffect() {
        // If it is lava, remove chill if it is applied.
        if (this.appliedTo.getBoardTile().groundType === GroundTypes.Lava) {
            return false;
        }

        // If the target has cold resistance, stop the chill effect.
        if (this.appliedTo.statusEffects[StatusEffects.ColdResistance.name]) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing on a chilling tile.
        // If so, keep chilled.
        if (this.appliedTo.getBoardTile().groundType.StatusEffect === Chill) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}

Chill.prototype._effectOnStart = true;
Chill.prototype._startingEffectsRemaining = 2;
Chill.prototype._startEffectEventName = EventsList.effect_start_chill;
Chill.prototype._stopEffectEventName = EventsList.effect_stop_chill;
Chill.prototype.moveRateModifier = 2;
StatusEffects.Chill = Chill;

class BrokenBones extends StatusEffect { }
const brokenBonesDamageConfig = require("./ModHitPointConfigs").BrokenBones;

BrokenBones.prototype._effectOnStart = false;
BrokenBones.prototype._startingEffectsRemaining = 5;
BrokenBones.prototype._startEffectEventName = EventsList.effect_start_broken_bones;
BrokenBones.prototype._stopEffectEventName = EventsList.effect_stop_broken_bones;
BrokenBones.prototype._moveDamageAmount = brokenBonesDamageConfig.damageAmount;
BrokenBones.prototype._moveDamageTypes = brokenBonesDamageConfig.damageTypes;
BrokenBones.prototype._moveDamageArmourPiercing = brokenBonesDamageConfig.damageArmourPiercing;
BrokenBones.prototype.moveRateModifier = 1.4;
StatusEffects.BrokenBones = BrokenBones;

module.exports = StatusEffects;

const GroundTypes = require("../board/GroundTypes");
