
var counter = 1;
function registerFaction () {
    counter += 1;
    return counter;
}

const Factions = {

    Barbarians:     registerFaction(),
    CityGuards:     registerFaction(),
    Citizens:       registerFaction(),
    Goblins:        registerFaction(),
    HostileAnimals: registerFaction(),
    Mages:          registerFaction(),
    Necromancers:   registerFaction(),
    Outlaws:        registerFaction(),
    PeacefulAnimals:registerFaction(),
    Vampires:       registerFaction(),
    Zombies:        registerFaction(),

};

// TODO: add some kind of 'defaultRelationshipStatus' for factions to make them normally hostile/friendly etc if a certain relationship is not specified
// TODO: and maybe a 'hosileTo', 'friendlyTo, etc lists

Factions.RelationshipStatuses = {
    // Will help if attacked, heal if injured, etc.
    Friendly: 1,
    // Attack on sight.
    Hostile: 2,
    // Will attack if attacked. Default when no relationship specified.
    Neutral: 3
};

const Relationships = {

    [Factions.CityGuards]: {
        [Factions.CityGuards]: Factions.RelationshipStatuses.Friendly,
        [Factions.Citizens]: Factions.RelationshipStatuses.Friendly,
        [Factions.Mages]: Factions.RelationshipStatuses.Friendly,
        [Factions.Outlaws]: Factions.RelationshipStatuses.Hostile,
        [Factions.Zombies]: Factions.RelationshipStatuses.Hostile
    },

    [Factions.Goblins]: {
        [Factions.CityGuards]: Factions.RelationshipStatuses.Hostile,
        [Factions.Outlaws]: Factions.RelationshipStatuses.Hostile,
        [Factions.Citizens]: Factions.RelationshipStatuses.Hostile,
        [Factions.Barbarians]: Factions.RelationshipStatuses.Hostile,
    },

    [Factions.Outlaws]: {
        [Factions.Outlaws]: Factions.RelationshipStatuses.Friendly,
        [Factions.CityGuards]: Factions.RelationshipStatuses.Hostile,
        [Factions.Citizens]: Factions.RelationshipStatuses.Hostile
    },

    [Factions.Zombies]: {
        [Factions.Zombies]: Factions.RelationshipStatuses.Friendly,
        [Factions.Outlaws]: Factions.RelationshipStatuses.Hostile,
        [Factions.Barbarians]: Factions.RelationshipStatuses.Hostile,
        [Factions.Citizens]: Factions.RelationshipStatuses.Hostile,
        [Factions.CityGuards]: Factions.RelationshipStatuses.Hostile,
        [Factions.Vampires]: Factions.RelationshipStatuses.Hostile,
        [Factions.Mages]: Factions.RelationshipStatuses.Hostile,
    },

    [Factions.HostileAnimals]: {
        [Factions.HostileAnimals]: Factions.RelationshipStatuses.Friendly,
        [Factions.Outlaws]: Factions.RelationshipStatuses.Hostile,
        [Factions.Barbarians]: Factions.RelationshipStatuses.Hostile,
        [Factions.CityGuards]: Factions.RelationshipStatuses.Hostile,
        [Factions.Citizens]: Factions.RelationshipStatuses.Hostile,
        [Factions.PeacefulAnimals]: Factions.RelationshipStatuses.Hostile,
        [Factions.Goblins]: Factions.RelationshipStatuses.Hostile,
        [Factions.Mages]: Factions.RelationshipStatuses.Hostile,
    },

    [Factions.Mages]: {
        [Factions.Mages]: Factions.RelationshipStatuses.Friendly,
        [Factions.CityGuards]: Factions.RelationshipStatuses.Friendly,
        [Factions.Citizens]: Factions.RelationshipStatuses.Friendly,
        [Factions.Zombies]: Factions.RelationshipStatuses.Hostile,
        [Factions.Necromancers]: Factions.RelationshipStatuses.Hostile,
    },

    [Factions.Vampires]: {
        [Factions.Vampires]: Factions.RelationshipStatuses.Friendly,
        [Factions.Outlaws]: Factions.RelationshipStatuses.Hostile,
        [Factions.Barbarians]: Factions.RelationshipStatuses.Hostile,
        [Factions.CityGuards]: Factions.RelationshipStatuses.Hostile,
        [Factions.Citizens]: Factions.RelationshipStatuses.Hostile,
        [Factions.Zombies]: Factions.RelationshipStatuses.Hostile,
        [Factions.Mages]: Factions.RelationshipStatuses.Hostile,
    }

};

Factions.getRelationship = function (fromFaction, toFaction) {
    if(Relationships[fromFaction] === undefined){
        return Factions.RelationshipStatuses.Neutral;
    }
    if(Relationships[fromFaction][toFaction] === undefined){
        return Factions.RelationshipStatuses.Neutral;
    }
    return Relationships[fromFaction][toFaction];
};

module.exports = Factions;