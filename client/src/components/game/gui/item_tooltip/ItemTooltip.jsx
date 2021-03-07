import React from "react";
import PropTypes from "prop-types";
import Utils from "../../../../shared/Utils";
import ItemTypes from "../../../../catalogues/ItemTypes.json";

function ItemTooltip({ itemConfig }) {
    return (
        <div>
            {Utils.getTextDef(`Item name: ${ItemTypes[itemConfig.typeCode].translationID}`)}
        </div>
    );
}

ItemTooltip.propTypes = {
    itemConfig: PropTypes.object.isRequired,
};

export default ItemTooltip;
