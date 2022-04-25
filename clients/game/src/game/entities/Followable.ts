import Follower from './Follower';

interface Followable extends Follower {
    followers: Array<Follower>;

    // TODO: add delete followers logic onDestroy? looks ok so far

    update(...args: any[]): void;

    addFollower(follower: Follower): void;

    removeFollower(follower: Follower): void;

    updateFollowers(): void;
}

export default Followable;
