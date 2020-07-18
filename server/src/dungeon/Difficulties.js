const Difficulties = {};

class Difficulty {
    constructor(name, gloryCost) {
        // If a dungeon already exists with the given name, stop the server.
        if(Difficulties[name]) Utils.error('Difficulty name is already taken:' + name);
        this.name = name;

        this.gloryCost = gloryCost || 0;
    }
}

Difficulties.Beginner = new Difficulty("Beginner", 200);
Difficulties.Advanced = new Difficulty("Advanced", 500);
Difficulties.Expert =   new Difficulty("Expert", 1000);
Difficulties.Master =   new Difficulty("Master", 5000);

module.exports = Difficulties;