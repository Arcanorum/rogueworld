interface ItemClientConfig {
    typeName: string;
    typeCode: string;
    hasUseEffect: boolean;
    equippable: boolean;
    translationId: string;
    iconSource: string;
    pickupSource?: string;
    pickupScaleModifier?: number;
    soundType?: string;
}

export default ItemClientConfig;
