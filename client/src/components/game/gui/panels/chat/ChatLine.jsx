import React from "react";
import PropTypes from "prop-types";
import "./ChatLine.scss";

function ChatLine({
    scope, displayName, message, getScopeColor,
}) {
    return (
        <p className={`chat-line ${getScopeColor(scope)}`}>
            <span className="display-name">{`${displayName}: `}</span>
            <span>{message}</span>
        </p>
    );
}

ChatLine.propTypes = {
    scope: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    getScopeColor: PropTypes.func.isRequired,
};

export default ChatLine;
