let counter = 1;
function registerFaction() {
    counter += 1;
    return counter;
}

// TODO: add some kind of 'defaultRelationshipStatus' for factions to make them normally hostile/friendly etc if a certain relationship is not specified
// TODO: and maybe a 'hosileTo', 'friendlyTo, etc lists
export const FactionRelationshipStatuses = {
    // Will help if attacked, heal if injured, etc.
    Friendly: 1,
    // Attack on sight.
    Hostile: 2,
    // Will attack if attacked. Default when no relationship specified.
    Neutral: 3,
};

const Factions = {
    Barbarians: registerFaction(),
    CityGuards: registerFaction(),
    Citizens: registerFaction(),
    Goblins: registerFaction(),
    HostileAnimals: registerFaction(),
    Mages: registerFaction(),
    Necromancers: registerFaction(),
    Outlaws: registerFaction(),
    PeacefulAnimals: registerFaction(),
    Vampires: registerFaction(),
    Zombies: registerFaction(),
};

const Relationships = {

    [Factions.CityGuards]: {
        [Factions.CityGuards]: FactionRelationshipStatuses.Friendly,
        [Factions.Citizens]: FactionRelationshipStatuses.Friendly,
        [Factions.Mages]: FactionRelationshipStatuses.Friendly,
        [Factions.Outlaws]: FactionRelationshipStatuses.Hostile,
        [Factions.Zombies]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Goblins]: {
        [Factions.CityGuards]: FactionRelationshipStatuses.Hostile,
        [Factions.Outlaws]: FactionRelationshipStatuses.Hostile,
        [Factions.Citizens]: FactionRelationshipStatuses.Hostile,
        [Factions.Barbarians]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Outlaws]: {
        [Factions.Outlaws]: FactionRelationshipStatuses.Friendly,
        [Factions.CityGuards]: FactionRelationshipStatuses.Hostile,
        [Factions.Citizens]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Zombies]: {
        [Factions.Zombies]: FactionRelationshipStatuses.Friendly,
        [Factions.Outlaws]: FactionRelationshipStatuses.Hostile,
        [Factions.Barbarians]: FactionRelationshipStatuses.Hostile,
        [Factions.Citizens]: FactionRelationshipStatuses.Hostile,
        [Factions.CityGuards]: FactionRelationshipStatuses.Hostile,
        [Factions.Vampires]: FactionRelationshipStatuses.Hostile,
        [Factions.Mages]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.HostileAnimals]: {
        [Factions.HostileAnimals]: FactionRelationshipStatuses.Friendly,
        [Factions.Outlaws]: FactionRelationshipStatuses.Hostile,
        [Factions.Barbarians]: FactionRelationshipStatuses.Hostile,
        [Factions.CityGuards]: FactionRelationshipStatuses.Hostile,
        [Factions.Citizens]: FactionRelationshipStatuses.Hostile,
        [Factions.PeacefulAnimals]: FactionRelationshipStatuses.Hostile,
        [Factions.Goblins]: FactionRelationshipStatuses.Hostile,
        [Factions.Mages]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Mages]: {
        [Factions.Mages]: FactionRelationshipStatuses.Friendly,
        [Factions.CityGuards]: FactionRelationshipStatuses.Friendly,
        [Factions.Citizens]: FactionRelationshipStatuses.Friendly,
        [Factions.Zombies]: FactionRelationshipStatuses.Hostile,
        [Factions.Necromancers]: FactionRelationshipStatuses.Hostile,
    },

    [Factions.Vampires]: {
        [Factions.Vampires]: FactionRelationshipStatuses.Friendly,
        [Factions.Outlaws]: FactionRelationshipStatuses.Hostile,
        [Factions.Barbarians]: FactionRelationshipStatuses.Hostile,
        [Factions.CityGuards]: FactionRelationshipStatuses.Hostile,
        [Factions.Citizens]: FactionRelationshipStatuses.Hostile,
        [Factions.Zombies]: FactionRelationshipStatuses.Hostile,
        [Factions.Mages]: FactionRelationshipStatuses.Hostile,
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
