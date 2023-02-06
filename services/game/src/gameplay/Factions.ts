let counter = 0;
function registerFaction() {
    counter += 1;
    return counter;
}

// TODO: add some kind of 'defaultRelationshipStatus' for factions to make them normally
// hostile/friendly etc if a certain relationship is not specified
// TODO: and maybe a 'hosileTo', 'friendlyTo, etc lists
export enum FactionRelationshipStatuses {
    // Will help if attacked, heal if injured, etc.
    Friendly,
    // Attack on sight.
    Hostile,
    // Will attack if attacked. Default when no relationship specified.
    Neutral,
}

const Factions = {
    Players: registerFaction(),
    Naturals: registerFaction(),
    Invaders: registerFaction(),
};

const Relationships = {
    [Factions.Players]: {
        [Factions.Players]: FactionRelationshipStatuses.Friendly,
        [Factions.Naturals]: FactionRelationshipStatuses.Neutral,
        [Factions.Invaders]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Naturals]: {
        [Factions.Naturals]: FactionRelationshipStatuses.Neutral,
        [Factions.Players]: FactionRelationshipStatuses.Neutral,
        [Factions.Invaders]: FactionRelationshipStatuses.Neutral,
    },

    [Factions.Invaders]: {
        [Factions.Invaders]: FactionRelationshipStatuses.Friendly,
        [Factions.Players]: FactionRelationshipStatuses.Hostile,
        [Factions.Naturals]: FactionRelationshipStatuses.Neutral,
    },
};

export function getFactionRelationship(fromFaction: number, toFaction: number) {
    if (Relationships[fromFaction] === undefined) {
        return FactionRelationshipStatuses.Neutral;
    }
    if (Relationships[fromFaction][toFaction] === undefined) {
        return FactionRelationshipStatuses.Neutral;
    }
    return Relationships[fromFaction][toFaction];
}

export default Factions;
