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

    eventResponses.effect_start_cold_resistance = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.coldResistanceEffect.anims.play("cold-resistance");
    };

    eventResponses.effect_stop_cold_resistance = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.coldResistanceEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.coldResistanceEffect.visible = false;
    };

    eventResponses.effect_start_chill = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.chillEffect.anims.play("chill");
    };

    eventResponses.effect_stop_chill = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.chillEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.chillEffect.visible = false;
    };

    eventResponses.effect_start_broken_bones = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.brokenBonesEffect.anims.play("broken-bones");
    };

    eventResponses.effect_stop_broken_bones = (data) => {
        if (dungeonz.gameScene.dynamics[data] === undefined) return;
        dungeonz.gameScene.dynamics[data].spriteContainer.brokenBonesEffect.anims.stop();
        dungeonz.gameScene.dynamics[data].spriteContainer.brokenBonesEffect.visible = false;
    };

    eventResponses.curse_set = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curseEffect) return;
        entity.spriteContainer.curseEffect.visible = true;
        entity.spriteContainer.curseEffect.anims.play("curse");

        // Play a sound for this player if they were cursed.
        if (data === PlayerState.entityID) {
            dungeonz.gameScene.sound.play("magic-bubbles-spell", { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.curse_removed = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curseEffect) return;
        entity.spriteContainer.curseEffect.anims.stop();
        entity.spriteContainer.curseEffect.visible = false;
    };

    eventResponses.enchantment_set = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.enchantmentEffect) return;
        entity.spriteContainer.enchantmentEffect.visible = true;
        entity.spriteContainer.enchantmentEffect.anims.play("enchantment");

        // Play a sound for this player if they were enchanted.
        if (data === PlayerState.entityID) {
            dungeonz.gameScene.sound.play("magical-light-sweep", { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.enchantment_removed = (data) => {
        const entity = dungeonz.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.enchantmentEffect) return;
        entity.spriteContainer.enchantmentEffect.anims.stop();
        entity.spriteContainer.enchantmentEffect.visible = false;
    };
};
