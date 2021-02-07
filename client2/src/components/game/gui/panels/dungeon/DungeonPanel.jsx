import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import Utils from "../../../../../shared/Utils";
import gameConfig from "../../../../../shared/GameConfig";
import "./DungeonPanel.scss";
import dungeonIcon from "../../../../../assets/images/gui/panels/dungeon/dungeon-icon.png";
import leavePartyButtonBorder from "../../../../../assets/images/gui/panels/dungeon/leave-party-button-border.png";
import createButtonBorderValid from "../../../../../assets/images/gui/panels/dungeon/create-button-border-valid.png";
import createButtonBorderInvalid from "../../../../../assets/images/gui/panels/dungeon/create-button-border-invalid.png";
import closeButtonImage from "../../../../../assets/images/gui/panels/panel-close-button.png";
import gloryIcon from "../../../../../assets/images/gui/hud/glory-icon.png";
import { PlayerState } from "../../../../../shared/state/States";
import { DUNGEON_PARTIES } from "../../../../../shared/EventTypes";

const leaveParty = (dungeonManagerID) => {
    window.ws.sendEvent("leave_dungeon_party", {
        dungeonID: dungeonManagerID,
    });
};

function PartySlot({ party, dungeonPortal }) {
    const joinPressed = () => {
        window.ws.sendEvent("join_dungeon_party", {
            dungeonID: dungeonPortal.dungeonManagerID,
            partyID: party.id,
        });
    };

    return (
        <div
          className="party-member-slot-cont party-slot-cont"
          onClick={joinPressed}
        >
            <div className="list-slot">{party.members[0].displayName}</div>
        </div>
    );
}

PartySlot.propTypes = {
    party: PropTypes.object.isRequired,
    dungeonPortal: PropTypes.object.isRequired,
};

function PartyMemberSlot({ member, partyLeader, dungeonPortal }) {
    const kickPressed = () => {
        window.ws.sendEvent("kick_dungeon_party_member", {
            dungeonID: dungeonPortal.dungeonManagerID,
            memberID: member.id,
        });
    };

    return (
        <div className="party-member-slot-cont">
            <div className="list-slot">{member.displayName}</div>
            {
                // Only show the kick buttons to the party leader.
                partyLeader.id === PlayerState.entityID
                // And don't show them a kick button for themself.
                && partyLeader.id !== member.id
                && (
                <div className="party-kick-member-button-cont">
                    <img
                      className="party-kick-member-button"
                      src={closeButtonImage}
                      onClick={kickPressed}
                    />
                </div>
                )
            }
        </div>
    );
}

PartyMemberSlot.propTypes = {
    member: PropTypes.object.isRequired,
    partyLeader: PropTypes.object.isRequired,
    dungeonPortal: PropTypes.object.isRequired,
};

function PartySelectionList({ parties, gloryCost, dungeonPortal }) {
    const createPressed = () => {
        // Check if the player has enough glory.
        if (PlayerState.glory >= gloryCost) {
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.ws.sendEvent("create_dungeon_party", {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col,
            });
        }
    };

    const getValidParties = (allParties) => {
        let validParties = allParties;

        // Filter out any parties that this player is in the kicked list of.
        validParties = validParties.filter((party) => (
            // Only add this party if the player is not on it's kicked list.
            party.kickedList.some(
                (kickedID) => kickedID === PlayerState.entityID,
            ) === false
        ));

        const { maxPlayers } = gameConfig.DungeonPrompts[dungeonPortal.dungeonManagerID];

        // Don't add the party if it is full.
        validParties = validParties.filter((party) => (
            party.members.length < maxPlayers
        ));

        return validParties;
    };

    return (
        <div className="party-selection-cont">
            <div>{`${Utils.getTextDef("Parties")}:`}</div>
            <div className="parties-cont">
                {
                    // Add a slot for each party.
                    getValidParties(parties).map((party) => (
                        <PartySlot
                          key={party.id}
                          party={party}
                          dungeonPortal={dungeonPortal}
                        />
                    ))
                }
            </div>
            <div className="bottom-cont">
                <div
                  className="create-button-cont centered"
                  onClick={createPressed}
                >
                    {PlayerState.glory >= gloryCost && (
                    <img
                      className="create-button centered"
                      src={createButtonBorderValid}
                    />
                    )}
                    {PlayerState.glory < gloryCost && (
                    <img
                      className="create-button centered"
                      src={createButtonBorderInvalid}
                    />
                    )}
                    <div className="centered button-text">
                        {Utils.getTextDef("Create")}
                    </div>
                </div>
            </div>
        </div>
    );
}

PartySelectionList.propTypes = {
    parties: PropTypes.array.isRequired,
    gloryCost: PropTypes.number.isRequired,
    dungeonPortal: PropTypes.object.isRequired,
};

function PartyMembersList({
    party, maxPlayers, gloryCost, dungeonPortal,
}) {
    // Find which member is the leader.
    // If this player is the party leader, show the start button.
    const [partyLeader] = useState(
        // Spread the leader into a new object for the state.
        { ...party.members[0] },
    );

    const startPressed = () => {
        // Check if the player has enough glory.
        if (PlayerState.glory >= gloryCost) {
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.ws.sendEvent("start_dungeon", {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col,
            });
        }
    };

    return (
        <div className="party-cont">
            <div className="party-player-count-text">
                {`${Utils.getTextDef("Party")}:${party.members.length}/${maxPlayers}`}
            </div>
            <div className="party-members">
                {party.members.map((member) => (
                    <PartyMemberSlot
                      key={member.id}
                      member={member}
                      partyLeader={partyLeader}
                      dungeonPortal={dungeonPortal}
                    />
                ))}
            </div>
            <div className="party-bottom-cont">
                <div
                  className="party-button-cont centered"
                  onClick={() => {
                      leaveParty(dungeonPortal.dungeonManagerID);
                  }}
                >
                    <img
                      className="party-button"
                      src={leavePartyButtonBorder}
                    />
                    <div className="party-button-text">
                        {Utils.getTextDef("Leave")}
                    </div>
                </div>
                {partyLeader.id === PlayerState.entityID && (
                <div
                  className="party-button-cont centered"
                  onClick={startPressed}
                >
                    <img
                      className="party-button"
                      src={createButtonBorderValid}
                    />
                    <div className="party-button-text">
                        {Utils.getTextDef("Start")}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

PartyMembersList.propTypes = {
    party: PropTypes.object.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    dungeonPortal: PropTypes.object.isRequired,
    gloryCost: PropTypes.number.isRequired,
};

function DungeonPanel({ onCloseCallback, dungeonPortal }) {
    // The info (dungeon name, glory cost, etc.) about this dungeon to load into the panel.
    const [prompt] = useState(gameConfig.DungeonPrompts[dungeonPortal.dungeonManagerID]);
    // The party this player is in, if any.
    const [party, setParty] = useState(null);
    // The list of all parties waiting to start this dungeon.
    const [parties, setParties] = useState([]);

    useEffect(() => {
        // Tell the server this player is looking at the interface for this dungeon, so they can receive updates for it.
        window.ws.sendEvent("focus_dungeon", {
            dungeonID: dungeonPortal.dungeonManagerID,
            row: dungeonPortal.row,
            col: dungeonPortal.col,
        });
    }, []);

    // Parties list change effect.
    useEffect(() => {
        // If this player is in any of the parties, show the party screen.
        const foundParty = parties.find((eachParty) => (
            eachParty.members.some((member) => (
                member.id === PlayerState.entityID
            ))
        ));

        if (foundParty) {
            // Show the party members list.
            setParty({ ...foundParty });
        }
        else {
            // Show the party selection list.
            setParty(null);
        }
    }, [parties]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(DUNGEON_PARTIES, (msd, data) => {
                setParties(data);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });

            // Need to tell the server when no longer looking at this
            // panel, to remove from any party they might have been in.
            leaveParty(dungeonPortal.dungeonManagerID);
        };
    }, []);

    return (
        <div className="dungeon-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width={440}
              height={420}
              panelName={Utils.getTextDef("Dungeon")}
              icon={dungeonIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="name">{Utils.getTextDef(prompt.nameDefinitionID)}</div>
                    <div className="panel-template-spacer" />
                    <div className="details-cont">
                        <div className="details-cont-item">
                            <div className="details-heading">{`${Utils.getTextDef("Difficulty")}:`}</div>
                            <div className="details-text">{Utils.getTextDef(prompt.difficulty)}</div>
                        </div>
                        <div className="panel-template-spacer" />
                        <div className="details-cont-item">
                            <div className="details-heading">{`${Utils.getTextDef("Entry cost")}:`}</div>
                            <div className="cost-cont">
                                <img className="cost-icon" src={gloryIcon} />
                                <div className="details-text">{prompt.gloryCost}</div>
                            </div>
                        </div>
                        <div className="panel-template-spacer" />
                        <div className="details-cont-item">
                            <div className="details-heading">{`${Utils.getTextDef("Max players")}:`}</div>
                            <div className="details-text">{prompt.maxPlayers}</div>
                        </div>
                    </div>
                    <div className="panel-template-spacer" />
                    <div>
                        {party && (
                        <PartyMembersList
                          party={party}
                          maxPlayers={prompt.maxPlayers}
                          gloryCost={prompt.gloryCost}
                          dungeonPortal={dungeonPortal}
                        />
                        )}
                        {!party && (
                        <PartySelectionList
                          parties={parties}
                          gloryCost={prompt.gloryCost}
                          dungeonPortal={dungeonPortal}
                        />
                        )}
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

DungeonPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
    dungeonPortal: PropTypes.object.isRequired,
};

export default DungeonPanel;
