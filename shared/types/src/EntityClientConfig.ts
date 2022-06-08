export interface SpriteConfig {
    extendsClassName?: string;
    displayName?: string;
    iconName?: string;
    animationSetName?: string;
    animationFrameSequence?: Array<number>;
    animationRepeats?: boolean;
    destroySound?: string;
}

export interface EntityClientConfig extends SpriteConfig {
    typeName: string;
    craftingStationClass?: string;
}
