import MagicEffect from './MagicEffect';
import MagicEffectConfig from './MagicEffectConfig';

export default class Curse extends MagicEffect {
    constructor(config: MagicEffectConfig) {
        if (config.entity.curse) config.entity.curse.remove();

        super(config);

        if (!this.entity) return;

        if (this.entity.curse) {
            // The entity didn't already have a curse, so tell all nearby players this now has one.
            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'curse_set',
                this.entity.id,
            );
        }

        this.entity.curse = this;
    }

    remove() {
        if (this.entity) {
            this.entity.curse = undefined;

            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'curse_removed',
                this.entity.id,
            );
        }
        super.remove();
    }
}
