import { makeAutoObservable } from "mobx";

class App {
    playing = false;

    loading = false;

    loadAccepted = true;

    constructor() {
        makeAutoObservable(this);
    }

    setPlaying(value) {
        this.playing = value;
    }

    setLoading(value) {
        this.loading = value;
        // When loading again, make sure the loading page gets shown.
        if (value) {
            this.setLoadAccepted(false);
        }
        // console.log("setting loading:", this.loading, ", accepted?", this.loadAccepted);
    }

    setLoadAccepted(value) {
        this.loadAccepted = value;
    }
}

class Player {
    hitPoints = 50;

    maxHitPoints = 100;

    energy = 0;

    maxEnergy = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setHitPoints(value) {
        this.hitPoints = value;
    }

    setEnergy(value) {
        this.energy = value;
    }
}

class Inventory {
    items = [];

    hotBar = [];

    weight = 0;

    maxWeight = 0;

    constructor() {
        makeAutoObservable(this);
    }

    addToInventory() {

    }

    addToHotBar() {

    }

    setWeight(value) {
        this.weight = value;
    }

    setMaxWeight(value) {
        this.maxWeight = value;
    }
}

export const app = new App();
export const player = new Player();
export const inventory = new Inventory();

export default {
    app,
    player,
    inventory,
};
