import React from "react";
import PropTypes from "prop-types";
import Utils from "../../../../shared/Utils";
import ItemTypes from "../../../../catalogues/ItemTypes.json";

function ItemTooltip({ itemTypeCode }) {
    return (
        <div>
            {Utils.getTextDef(`Item name: ${ItemTypes[itemTypeCode].translationID}`)}
        </div>
    );
}

ItemTooltip.propTypes = {
    itemTypeCode: PropTypes.string.isRequired,
};

export default ItemTooltip;
