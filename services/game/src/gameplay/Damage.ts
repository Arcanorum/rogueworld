import DamageTypes from './DamageTypes';

interface Damage {
    /**
     * How much damage (before defence mitigation) this damage will cause.
     */
    amount: number;

    /**
     * The types of damage this damage will cause.
     */
    types: Array<DamageTypes>;

    /**
     * What percent of defence will be ignored when dealing damage.
     * From 0 to 1.
     * e.g. 0.3 => 30%
     */
    penetration: number;
}

export default Damage;
