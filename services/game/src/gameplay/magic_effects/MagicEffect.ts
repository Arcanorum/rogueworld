import Entity from '../../entities/classes/Entity';
import MagicEffectConfig from './MagicEffectConfig';

export default class MagicEffect {
    /** The entity that this magic effect is affecting. */
    entity?: Entity;

    /** The source entity that this magic effect originates from. */
    source?: Entity;

    timeout: NodeJS.Timeout;

    duration = 10000;

    /**
     * @param config
     * @param config.entity - What this magic effect will affect.
     * @param config.source - The thing that caused this magic effect.
     */
    constructor({
        entity,
        source,
    }: MagicEffectConfig) {
        this.entity = entity;

        if (source) {
            this.source = source;
        }

        this.timeout = setTimeout(this.onTimeUp.bind(this), this.duration);
    }

    remove() {
        this.entity = undefined;

        this.source = undefined;

        clearTimeout(this.timeout);
    }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityDamaged() { return true; }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityDeath() { return true; }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityAttack() { return true; }

    onTimeUp() {
        this.remove();
    }
}
