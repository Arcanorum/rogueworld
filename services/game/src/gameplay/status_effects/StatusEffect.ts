import Entity from '../../entities/classes/Entity';
import DamageTypes from '../DamageTypes';

class StatusEffect {
    appliedTo: Entity;

    source: Entity | undefined;

    /**
     * The name of this effect, to be used as an ID in any lists of status effects.
     */
    effectName: string;

    /**
     * Should the effect be activated on start.
     */
    _effectOnStart!: boolean;

    /**
     * How much to modify the hitpoints of the thing it is applied to by each effect.
     */
    _effectDamageAmount!: number;

    /**
     * The types of damage to deal.
     */
    _effectDamageTypes!: Array<DamageTypes>;

    /**
     * How much defence that damage dealt will ignore. 0 to 1.
     */
    _effectDamagePenetration!: number;

    /**
     * How many hitpoints to restore.
     */
    _healAmount!: number;

    /**
     * How much damage to deal when the entity moves.
     */
    _moveDamageAmount!: number;

    /**
     * The types of damage to deal when the entity moves.
     */
    _moveDamageTypes!: Array<DamageTypes>;

    /**
     * How much defence that damage dealt when the entity moves will ignore. 0 to 1.
     */
    _moveDamagePenetration!: number;

    /**
     * How many more times this effect will happen before stopping.
     */
    _effectsRemaining!: number;

    /**
     * How long will this effect last for when started.
     * Starting the effect multiple times does not stack this duration.
     */
    _startingEffectsRemaining!: number;

    /**
     * A reference to the loop of this effect.
     * Counts down the remaining duration, and is used to stop and thus remove this status effect.
     */
    _effectLoop!: NodeJS.Timeout;

    /**
     * How long between each time the effect will be activated.
     */
    _effectRate!: number;

    /**
     * The event name that will be sent when the effect starts.
     */
    _startEffectEventName!: string;

    /**
     * The event name that will be sent when the effect stops.
     */
    _stopEffectEventName!: string;

    /**
     * Whether this status effect does something bad.
     */
    hazardous!: boolean;

    /**
     * How much to modify the move rate of the entity this is applied to.
     * >1 increase move rate, <1 decrease move rate.
     * Cumulative with other modifiers.
     */
    moveRateModifier!: number;

    constructor(entity: Entity, source?: Entity) {
        this.appliedTo = entity;
        this.source = source;
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
        this.appliedTo.board?.emitToNearbyPlayers(
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
                {
                    amount: this._effectDamageAmount,
                    types: this._effectDamageTypes,
                    penetration: this._effectDamagePenetration,
                },
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
                { amount: this._healAmount },
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
            this.appliedTo.board?.emitToNearbyPlayers(
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
                {
                    amount: this._moveDamageAmount,
                    types: this._moveDamageTypes,
                    penetration: this._moveDamagePenetration,
                },
                this.source,
            );
            // Stop this effect if the thing it is applied to died from the damage above.
            if (this.appliedTo.hitPoints < 1) {
                this.stop();
            }
        }
    }
}

StatusEffect.prototype._effectOnStart = false;

StatusEffect.prototype._effectDamageAmount = 0;

StatusEffect.prototype._effectDamageTypes = [];

StatusEffect.prototype._effectDamagePenetration = 0;

StatusEffect.prototype._healAmount = 0;

StatusEffect.prototype._moveDamageAmount = 0;

StatusEffect.prototype._moveDamageTypes = [];

StatusEffect.prototype._moveDamagePenetration = 0;

StatusEffect.prototype._effectsRemaining = 0;

StatusEffect.prototype._startingEffectsRemaining = 0;

StatusEffect.prototype._effectLoop = setTimeout(() => { /**/ });

StatusEffect.prototype._effectRate = 1000;

StatusEffect.prototype._startEffectEventName = '';

StatusEffect.prototype._stopEffectEventName = '';

StatusEffect.prototype.hazardous = false;

StatusEffect.prototype.moveRateModifier = 1;

export default StatusEffect;
