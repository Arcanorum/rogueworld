import eventResponses from './EventResponses';
import Global from '../../shared/Global';
import { GUIState, PlayerState } from '../../shared/state';

const StatusEffects = () => {
    eventResponses.effect_start_burn = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.burnEffect) {
            entity.spriteContainer.burnEffect = entity.spriteContainer.addEffect('burn-effect-1');
        }
        entity.spriteContainer.burnEffect.anims.play('burn');
    };

    eventResponses.effect_stop_burn = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.burnEffect) return;
        entity.spriteContainer.burnEffect.destroy();
        delete entity.spriteContainer.burnEffect;
    };

    eventResponses.effect_start_poison = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.poisonEffect) {
            entity.spriteContainer.poisonEffect = entity.spriteContainer.addEffect('poison-effect-1');
        }
        entity.spriteContainer.poisonEffect.anims.play('poison');
    };

    eventResponses.effect_stop_poison = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.poisonEffect) return;
        entity.spriteContainer.poisonEffect.destroy();
        delete entity.spriteContainer.poisonEffect;
    };

    eventResponses.effect_start_health_regen = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.healthRegenEffect) {
            entity.spriteContainer.healthRegenEffect = entity.spriteContainer.addEffect('health-regen-effect-1');
        }
        entity.spriteContainer.healthRegenEffect.anims.play('health-regen');
    };

    eventResponses.effect_stop_health_regen = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.healthRegenEffect) return;
        entity.spriteContainer.healthRegenEffect.destroy();
        delete entity.spriteContainer.healthRegenEffect;
    };

    eventResponses.effect_start_cured = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curedEffect) return;
        entity.spriteContainer.curedEffect.anims.play('cured');
    };

    eventResponses.effect_stop_cured = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curedEffect) return;
        entity.spriteContainer.curedEffect.anims.stop();
        entity.spriteContainer.curedEffect.visible = false;
    };

    eventResponses.effect_start_cold_resistance = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.coldResistanceEffect) return;
        entity.spriteContainer.coldResistanceEffect.anims.play('cold-resistance');
    };

    eventResponses.effect_stop_cold_resistance = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.coldResistanceEffect) return;
        entity.spriteContainer.coldResistanceEffect.anims.stop();
        entity.spriteContainer.coldResistanceEffect.visible = false;
    };

    eventResponses.effect_start_chill = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.chillEffect) return;
        entity.spriteContainer.chillEffect.anims.play('chill');
    };

    eventResponses.effect_stop_chill = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.chillEffect) return;
        entity.spriteContainer.chillEffect.anims.stop();
        entity.spriteContainer.chillEffect.visible = false;
    };

    eventResponses.effect_start_broken_bones = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.brokenBonesEffect) {
            entity.spriteContainer.brokenBonesEffect = entity.spriteContainer.addEffect('broken-bones-effect-1');
        }
        entity.spriteContainer.brokenBonesEffect.anims.play('broken-bones');
    };

    eventResponses.effect_stop_broken_bones = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.brokenBonesEffect) return;
        entity.spriteContainer.brokenBonesEffect.destroy();
        delete entity.spriteContainer.brokenBonesEffect;
    };

    eventResponses.curse_set = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curseEffect) return;
        entity.spriteContainer.curseEffect.visible = true;
        entity.spriteContainer.curseEffect.anims.play('curse');

        // Play a sound for this player if they were cursed.
        if (data === PlayerState.entityId) {
            Global.gameScene.sound.play('magic-bubbles-spell', { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.curse_removed = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.curseEffect) return;
        entity.spriteContainer.curseEffect.anims.stop();
        entity.spriteContainer.curseEffect.visible = false;
    };

    eventResponses.enchantment_set = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.enchantmentEffect) return;
        entity.spriteContainer.enchantmentEffect.visible = true;
        entity.spriteContainer.enchantmentEffect.anims.play('enchantment');

        // Play a sound for this player if they were enchanted.
        if (data === PlayerState.entityId) {
            Global.gameScene.sound.play('magical-light-sweep', { volume: GUIState.effectsVolume / 100 });
        }
    };

    eventResponses.enchantment_removed = (data: string) => {
        const entity = Global.gameScene.dynamics[data];
        if (!entity) return;
        if (!entity.spriteContainer.enchantmentEffect) return;
        entity.spriteContainer.enchantmentEffect.anims.stop();
        entity.spriteContainer.enchantmentEffect.visible = false;
    };
};

export default StatusEffects;
