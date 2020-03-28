
var counter = 1;
function registerBehaviour () {
    counter += 1;
    return counter;
}

const Behaviours = {
    /**
     * Cowardly:
     * - Runs on sight.
     * - Doesn't fight back.
     */
    Cowardly: registerBehaviour(),
    /**
     * Pacifist:
     * - Runs on attacked.
     * - Doesn't fight back.
     */
    Pacifist: registerBehaviour(),
    /**
     * Defensive:
     * - Runs on sight.
     * - Fights back.
     */
    Defensive: registerBehaviour(),
    /**
     * Aggressive:
     * - Attacks hostiles in range.
     * - Fights back.
     */
    Aggressive: registerBehaviour(),
    /**
     * Savage:
     * - Attacks hostiles and neutrals in range.
     * - Fights back.
     */
    Savage: registerBehaviour(),
    /**
     * Retaliative:
     * - Fights back.
     */
    Retaliative: registerBehaviour(),
    /**
     * Opportunistic:
     * - Attacks hostiles and neutrals in range if they are on low hitpoints.
     * - Runs on attacked, unless attacker is on low hitpoints.
     */
    Opportunistic: registerBehaviour()
};

module.exports = Behaviours;