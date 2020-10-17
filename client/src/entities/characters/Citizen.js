import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Citizen"));
    }

    static setupAnimations() {
        const duration = 500;

        _this.anims.create({
            key: "human-up",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "human-up-1" },
                { frame: "human-up-2" },
                { frame: "human-up-1" },
                { frame: "human-up-3" }
            ],
            duration
        });

        _this.anims.create({
            key: "human-down",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "human-down-1" },
                { frame: "human-down-2" },
                { frame: "human-down-1" },
                { frame: "human-down-3" }
            ],
            duration
        });

        _this.anims.create({
            key: "human-left",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "human-left-1" },
                { frame: "human-left-2" },
                { frame: "human-left-1" },
                { frame: "human-left-3" }
            ],
            duration
        });

        _this.anims.create({
            key: "human-right",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "human-right-1" },
                { frame: "human-right-2" },
                { frame: "human-right-1" },
                { frame: "human-right-3" }
            ],
            duration
        });
    }

};

Entity.animationBaseName = "human";

Entity.prototype.baseFrames = {
    up: "human-up-1",
    down: "human-down-1",
    left: "human-left-1",
    right: "human-right-1"
};

export default Entity;