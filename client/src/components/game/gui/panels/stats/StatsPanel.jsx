import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import "./StatsPanel.scss";
import statsIcon from "../../../../../assets/images/gui/hud/stats-icon.png";
import armouryIcon from "../../../../../assets/images/gui/panels/stats/armoury-icon.png";
// import clanshipIcon from "../../../../../assets/images/gui/panels/stats/clanship-icon.png";
import gatheringIcon from "../../../../../assets/images/gui/panels/stats/gathering-icon.png";
import magicIcon from "../../../../../assets/images/gui/panels/stats/magic-icon.png";
import meleeIcon from "../../../../../assets/images/gui/panels/stats/melee-icon.png";
import potionryIcon from "../../../../../assets/images/gui/panels/stats/potionry-icon.png";
import rangedIcon from "../../../../../assets/images/gui/panels/stats/ranged-icon.png";
import tooleryIcon from "../../../../../assets/images/gui/panels/stats/toolery-icon.png";
import weaponryIcon from "../../../../../assets/images/gui/panels/stats/weaponry-icon.png";
import { STATS_VALUE } from "../../../../../shared/EventTypes";
import { PlayerState } from "../../../../../shared/state/States";
import Utils from "../../../../../shared/Utils";

function InfoCont({
    stat, onClick,
}) {
    return (
        <div
          className="info-cont centered"
          onClick={onClick}
        >
            <div className="name">{Utils.getTextDef(`Stat name: ${stat.textDefID}`)}</div>
            <div className="description">{Utils.getTextDef(`Stat description: ${stat.textDefID}`)}</div>
            <div className="level">{`${Utils.getTextDef("Level")}: ${stat.level}`}</div>
            <div className="exp">{`${Utils.getTextDef("Exp")}: ${stat.exp} / ${stat.nextLevelExpRequirement}`}</div>
            <div className="close">Press to close</div>
        </div>
    );
}

InfoCont.propTypes = {
    stat: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

function StatCont({
    icon, onClick, stat,
}) {
    return (
        <div
          className="stat-cont"
          onClick={() => {
              onClick(stat);
          }}
        >
            <div className="name border">{stat.textDefID}</div>
            <div className="margin">
                <div className="name">{stat.textDefID}</div>
                <div className="level-cont">
                    <img src={icon} className="icon" />
                    <div className="level">{stat.level}</div>
                </div>
                <div className="remaining">{stat.nextLevelExpRequirement - stat.exp}</div>
            </div>
        </div>
    );
}

StatCont.propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    stat: PropTypes.object.isRequired,
};

function StatsPanel({ onCloseCallback }) {
    const [selectedStat, setSelectedStat] = useState(null);
    const [stats, setStats] = useState(PlayerState.stats);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(STATS_VALUE, (msd, data) => {
                setStats(data.new);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="stats-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width={540}
              height={360}
              panelName={Utils.getTextDef("Stats panel: name")}
              icon={statsIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="grid-cont">
                    <div className="grid">
                        <StatCont
                          icon={meleeIcon}
                          onClick={setSelectedStat}
                          stat={stats.Melee}
                        />
                        <StatCont
                          icon={rangedIcon}
                          onClick={setSelectedStat}
                          stat={stats.Ranged}
                        />
                        <StatCont
                          icon={magicIcon}
                          onClick={setSelectedStat}
                          stat={stats.Magic}
                        />
                        <StatCont
                          icon={gatheringIcon}
                          onClick={setSelectedStat}
                          stat={stats.Gathering}
                        />
                        <StatCont
                          icon={weaponryIcon}
                          onClick={setSelectedStat}
                          stat={stats.Weaponry}
                        />
                        <StatCont
                          icon={armouryIcon}
                          onClick={setSelectedStat}
                          stat={stats.Armoury}
                        />
                        <StatCont
                          icon={tooleryIcon}
                          onClick={setSelectedStat}
                          stat={stats.Toolery}
                        />
                        <StatCont
                          icon={potionryIcon}
                          onClick={setSelectedStat}
                          stat={stats.Potionry}
                        />
                    </div>
                </div>
                {selectedStat && (
                <InfoCont
                  stat={selectedStat}
                  onClick={() => {
                      setSelectedStat(null);
                  }}
                />
                )}
            </PanelTemplate>
        </div>
    );
}

StatsPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default StatsPanel;
