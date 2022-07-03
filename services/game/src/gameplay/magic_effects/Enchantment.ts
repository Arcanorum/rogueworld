import MagicEffect from './MagicEffect';
import MagicEffectConfig from './MagicEffectConfig';

export default class Enchantment extends MagicEffect {
    constructor(config: MagicEffectConfig) {
        if (config.entity.enchantment) config.entity.enchantment.remove();

        super(config);

        if (!this.entity) return;

        if (this.entity.enchantment) {
            // The entity didn't already have an enchantment, so tell all nearby players this now
            // has one.
            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'enchantment_set',
                this.entity.id,
            );
        }
        this.entity.enchantment = this;
    }

    remove() {
        if (this.entity) {
            this.entity.enchantment = undefined;
            if (this.entity.board) {
                this.entity.board.emitToNearbyPlayers(
                    this.entity.row,
                    this.entity.col,
                    'enchantment_removed',
                    this.entity.id,
                );
            }
        }
        super.remove();
    }
}
