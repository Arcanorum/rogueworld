import Config from '../../../../shared/Config';
import getTextDef from '../../../../shared/GetTextDef';

function ItemTooltip({
    itemTypeCode,
}: {
    itemTypeCode: string;
}) {
    return (
        <div>
            {getTextDef(`Item name: ${Config.ItemTypes[itemTypeCode].translationId}`)}
        </div>
    );
}

export default ItemTooltip;
