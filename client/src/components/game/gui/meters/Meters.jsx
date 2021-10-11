import React, { useEffect, useState, useRef } from "react";
import PubSub from "pubsub-js";
import hitpointIcon from "../../../../assets/images/gui/hud/hitpoint-icon.png";
import hitpointCounter from "../../../../assets/images/gui/hud/hitpoint-counter.png";
import energyIcon from "../../../../assets/images/gui/hud/energy-icon.png";
import combatIcon from "../../../../assets/images/gui/hud/combat-icon.png";
import outOfcombatIcon from "../../../../assets/images/gui/hud/out-of-combat-icon.png";
import energyCounter from "../../../../assets/images/gui/hud/energy-counter.png";
import emptyCounter from "../../../../assets/images/gui/hud/empty-counter.png";
import "./Meters.scss";
import {
    HITPOINTS_VALUE, MAX_HITPOINTS_VALUE, ENERGY_VALUE, MAX_ENERGY_VALUE,
    COMBAT_STATUS_TRIGGER, USED_ITEM,
} from "../../../../shared/EventTypes";
import { GUIState, InventoryState, PlayerState } from "../../../../shared/state/States";
import Utils from "../../../../shared/Utils";
import inventoryIcon from "../../../../assets/images/gui/hud/inventory-icon.png";
import PanelButton from "../panel_button/PanelButton";
import Panels from "../panels/PanelsEnum";
import ItemTypes from "../../../../catalogues/ItemTypes.json";

// How many of the little circle counters to show on each meter bar.
const maxCounters = 20;

function Counters({ stat, maxStat, counterImage }) {
    // The value might be in 0.5s as well as whole numbers, so round down to only count each full counter.
    stat = Math.floor(stat);
    // Get the % of the stat this player has. i.e.
    const filledCount = Math.floor((stat / maxStat) * maxCounters);
    // Add some counters, up to the max amount, and show them filled in
    // if they are within the amount of HP/energy that the player has.
    return Array.from({ length: maxCounters }, (v, i) => {
        if (i < filledCount) {
            return <img key={i} src={counterImage} draggable={false} className="meter-counter" />;
        }
        return <img key={i} src={emptyCounter} draggable={false} className="meter-counter" />;
    });
}

const Tooltip = (content) => (
    <div style={{ width: "500px" }}>{content}</div>
);

function Meters() {
    const [hitPoints, setHitPoints] = useState(0);
    const [maxHitPoints, setMaxHitPoints] = useState(0);

    const [energy, setEnergy] = useState(0);
    const [maxEnergy, setMaxEnergy] = useState(0);

    const [combatTimer, setCombatTimer] = useState(0);

    let combatTimerUpdateInterval = -1;
    let combatTimerInternal = 0;

    const updateCombatTimer = () => {
        combatTimerInternal = Math.max(0, combatTimerInternal - 1000);
        setCombatTimer(Math.ceil(combatTimerInternal / 1000));
    };

    const refreshCombatTimer = () => {
        if (combatTimerUpdateInterval !== -1) {
            clearInterval(combatTimerUpdateInterval);
        }
        combatTimerUpdateInterval = setInterval(() => updateCombatTimer(), 1000);
    };

    const energyMeterRef = useRef();

    const shake = (ref) => {
        if (ref.current === null) return;
        ref.current.classList.toggle("shake-horizontal");
    };

    const checkEnergy = (data) => {
        const itemUsed = ItemTypes[data.typeCode];

        const itemHolding = InventoryState.holding === null
            ? false
            : ItemTypes[InventoryState.holding.typeCode];

        // Item used is `equippable`
        if (itemUsed.equippable) {
            // Check if item used is item holding
            if (itemUsed.typeCode === itemHolding.typeCode) {
                // Check if item used useEnergyCost > energy
                if (itemHolding.useEnergyCost > PlayerState.energy) {
                    // Make it shake
                    shake(energyMeterRef);
                }
            }
        }
        // Item used is not equippable (i.e. Trap)
        else if (itemUsed.useEnergyCost > PlayerState.energy) {
            // Make it shake
            shake(energyMeterRef);
        }
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                setHitPoints(data.new);
            }),
            PubSub.subscribe(MAX_HITPOINTS_VALUE, (msg, data) => {
                setMaxHitPoints(data.new);
            }),
            PubSub.subscribe(ENERGY_VALUE, (msg, data) => {
                setEnergy(data.new);
            }),
            PubSub.subscribe(MAX_ENERGY_VALUE, (msg, data) => {
                setMaxEnergy(data.new);
            }),
            PubSub.subscribe(COMBAT_STATUS_TRIGGER, (msg, data) => {
                data = parseInt(data, 10);
                if (Number.isNaN(data)) {
                    data = 0;
                }
                combatTimerInternal = data;
                setCombatTimer(Math.ceil(combatTimerInternal / 1000));
                refreshCombatTimer();
            }),
            PubSub.subscribe(USED_ITEM, (msg, data) => {
                checkEnergy(data);
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
            if (combatTimerUpdateInterval !== -1) {
                clearInterval(combatTimerUpdateInterval);
            }
            combatTimerUpdateInterval = -1;
        };
    }, []);

    return (
        <div className="meters gui-scalable">
            <div className="inventory-button">
                <PanelButton
                  icon={inventoryIcon}
                  onClick={() => {
                      GUIState.setActivePanel(Panels.Inventory);
                  }}
                  tooltipText={`${Utils.getTextDef("Inventory tooltip")} ( I, right-click, spacebar )`}
                />
            </div>
            <div className="meter">
                <img
                  className="gui-icon"
                  src={hitpointIcon}
                  draggable={false}
                  onMouseEnter={() => {
                      GUIState.setTooltipContent(
                          Tooltip(Utils.getTextDef("Hitpoint tooltip")),
                      );
                  }}
                  onMouseLeave={() => {
                      GUIState.setTooltipContent(null);
                  }}
                />
                <div>
                    <Counters
                      stat={hitPoints}
                      maxStat={maxHitPoints}
                      counterImage={hitpointCounter}
                    />
                </div>
            </div>
            <div
              ref={energyMeterRef}
              className="meter"
            >
                <img
                  className="gui-icon"
                  src={energyIcon}
                  draggable={false}
                  onMouseEnter={() => {
                      GUIState.setTooltipContent(
                          Tooltip(Utils.getTextDef("Energy tooltip")),
                      );
                  }}
                  onMouseLeave={() => {
                      GUIState.setTooltipContent(null);
                  }}
                />
                <div id="energy-counters">
                    <Counters
                      stat={energy}
                      maxStat={maxEnergy}
                      counterImage={energyCounter}
                    />
                </div>
            </div>
            <div className="combat-indicator-icon">
                <img
                  className="gui-icon"
                  src={((combatTimer > 0) && combatIcon) || outOfcombatIcon}
                  draggable={false}
                  onMouseEnter={() => {
                      GUIState.setTooltipContent(
                          Tooltip(Utils.getTextDef("Combat tooltip")),
                      );
                  }}
                  onMouseLeave={() => {
                      GUIState.setTooltipContent(null);
                  }}
                />
                { (combatTimer > 0) && <span className="high-contrast-text">{combatTimer}</span> }
            </div>
        </div>
    );
}

export default Meters;
