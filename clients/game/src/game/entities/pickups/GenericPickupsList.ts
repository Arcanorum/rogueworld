import { message } from '@rogueworld/utils';
import Global from '../../../shared/Global';
import Pickup from './Pickup';

/**
 * Creates a generic class for a pickup based on the Pickup class.
 * @param frameName - The name of the texture (in the game atlas) to use for this sprite.
 * @param scaleModifier - A multiplier to scale the sprite by, after also being scaled to GAME_SCALE.
 */
const makeClass = ({
    frameName,
    scaleModifier = 1,
}: {
    frameName: string;
    scaleModifier?: number;
}) => {
    class GenericPickup extends Pickup { }
    GenericPickup.frameName = `pickup-${frameName}`;
    GenericPickup.scaleModifier = scaleModifier;

    return GenericPickup;
};

/**
 * A list of pickup items that have their class created on startup, instead of being in a dedicated class file.
 * Avoids having many class files that are exactly the same (apart from specifying the texture frame).
 * A pickup type can still have it's own class file if it needs to do something special.
 * Just make a JS file for it in /entities/pickups (it must be prefixed with "Pickup", i.e. "PickupIronSword")
 * and then extend the Pickup class in it.
 */
export const generateGenericPickupsList = () => {
    message('Generating generic pickups list');
    return Object.values(Global.Config.ItemTypes).reduce((accumulator, itemType) => {
        accumulator[itemType.typeName] = makeClass({
            frameName: itemType.pickupSource || '',
            scaleModifier: itemType.pickupScaleModifier,
        });

        return accumulator;
    }, {} as {[key: string]: typeof Pickup});
};
