import { makeAutoObservable } from "mobx";

class States {
    playing = false;

    constructor() {
        makeAutoObservable(this);
    }

    setPlaying(value) {
        console.log("setting playing:", value);
        this.playing = value;
    }
}

export default new States();
