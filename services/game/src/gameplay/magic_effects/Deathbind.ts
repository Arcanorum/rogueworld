import { OneMinute } from '@rogueworld/types';
import Curse from './Curse';

export default class Deathbind extends Curse {
    onEntityDeath() {
        if (this.entity) {
            // if (this.entity.CorpseType) {
            //     new this.entity.CorpseType.prototype.ZombieType({
            //         row: this.entity.row,
            //         col: this.entity.col,
            //         board: this.entity.board,
            //     }).emitToNearbyPlayers();
            // }
        }
        this.remove();
        return false;
    }
}
Deathbind.prototype.duration = OneMinute * 5;
