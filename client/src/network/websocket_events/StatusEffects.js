import eventResponses from "./EventResponses";
import dungeonz from "../../shared/Global";
import { GUIState, PlayerState } from "../../shared/state/States";

export default () => {
    eventResponses.effect_start_burn = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.burnEffect.anims.play("burn");
    };

    eventResponses.effect_stop_burn = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.burnEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.burnEffect.visible = false;
    };

    eventResponses.effect_start_poison = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.poisonEffect.anims.play("poison");
    };

    eventResponses.effect_stop_poison = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.poisonEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.poisonEffect.visible = false;
    };

    eventResponses.effect_start_health_regen = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.healthRegenEffect.anims.play("health-regen");
    };

    eventResponses.effect_stop_health_regen = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.healthRegenEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.healthRegenEffect.visible = false;
    };

    eventResponses.effect_start_energy_regen = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.energyRegenEffect.anims.play("energy-regen");
    };

    eventResponses.effect_stop_energy_regen = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.energyRegenEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.energyRegenEffect.visible = false;
    };

    eventResponses.effect_start_cured = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.curedEffect.anims.play("cured");
    };

    eventResponses.effect_stop_cured = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.curedEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.curedEffect.visible = false;
    };

    eventResponses.curse_set = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (entity === undefined) return;
        if (entity.spriteContainer.curseIcon === undefined) return;
        entity.spriteContainer.curseIcon.visible = true;

        // Play a sound for this player if they were cursed.
        if (data === PlayerState.entityID) {
            dungeonz.gameScene.sound.play("magic-bubbles-spell", { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.curse_removed = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (entity === undefined) return;
        if (entity.spriteContainer.curseIcon === undefined) return;
        entity.spriteContainer.curseIcon.visible = false;
    };

    eventResponses.enchantment_set = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (entity === undefined) return;
        if (entity.spriteContainer.enchantmentIcon === undefined) return;
        entity.spriteContainer.enchantmentIcon.visible = true;

        // Play a sound for this player if they were enchanted.
        if (data === PlayerState.entityID) {
            dungeonz.gameScene.sound.play("magical-light-sweep", { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.enchantment_removed = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (entity === undefined) return;
        if (entity.spriteContainer.enchantmentIcon === undefined) return;
        entity.spriteContainer.enchantmentIcon.visible = false;
    };
};
