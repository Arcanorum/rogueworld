import { EntityCategories } from '@rogueworld/types';

interface DamageModifier {
    category: EntityCategories;
    multiplier: number;
}

export default DamageModifier;
