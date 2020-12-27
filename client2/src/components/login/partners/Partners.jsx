import React from "react";
import PropTypes from "prop-types";
import ioGamesLogo from "./assets/iogames-space-logo.png";
import crazyGamesLogo from "./assets/crazy-games-logo.png";

function Partners({ toggleShowPartners }) {
    return (
        <div className="partners-cont press-start-font">
            <div className="partners-close" onClick={toggleShowPartners}>x</div>
            <div className="partners-header">Thanks to our partners</div>
            <a href="http://iogames.space/" rel="noreferrer" target="_blank">
                <img className="iogames-space-logo" src={ioGamesLogo} />
            </a>
            <a href="https://www.crazygames.com/c/io" rel="noreferrer" target="_blank">
                <img className="crazy-games-logo" src={crazyGamesLogo} />
            </a>
        </div>
    );
}

Partners.propTypes = {
    toggleShowPartners: PropTypes.func.isRequired,
};

export default Partners;
