export interface SpriteConfig {
    extendsClassName?: string;
    displayName?: string;
    iconName?: string;
    animationSetName?: string;
    animationFrameSequence?: Array<number>;
    animationRepeats?: boolean;
}

export interface EntityDataConfig extends SpriteConfig {
    typeName: string;
}
