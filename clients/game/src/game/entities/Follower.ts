import Followable from './Followable';

interface Follower {
    x: number;
    y: number;
    xOffset?: number;
    yOffset?: number;
    following?: Followable;
}

export default Follower;
