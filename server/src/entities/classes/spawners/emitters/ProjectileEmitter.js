const Entity = require("../../Entity");

class ProjectileEmitter extends Entity {
    constructor(config) {
        super(config);

        this.ProjectileType = config.ProjectileType;

        // Use the range of the projectile to be emitted.
        this.range = config.range || config.ProjectileType.prototype.range || 5;

        this.direction = config.direction;

        this.spawnRate = config.spawnRate || 5000;

        this.spawnInterval = 0;

        this.delayTimeout = setTimeout(() => {
            this.spawnInterval = setInterval(this.spawn.bind(this), this.spawnRate);

            // Give the server some time to finish setting up before starting the emitters, or the
            // delays will be over before it is ready.
        }, (config.delay + 5000) || 5000);
    }

    onDestroy() {
        clearTimeout(this.delayTimeout);
        clearInterval(this.spawnInterval);
    }

    checkDirection() {
        return true;

        // if(this.direction === this.Directions.UP) {
        //     for
        // }
    }

    spawn() {
        if (!this.checkDirection()) {
            //
            return;
        }

        const projectile = new this.ProjectileType(
            {
                row: this.row,
                col: this.col,
                board: this.board,
                direction: this.direction,
            },
        );

        projectile.range = this.range;

        projectile.emitToNearbyPlayers();
    }
}

module.exports = ProjectileEmitter;
