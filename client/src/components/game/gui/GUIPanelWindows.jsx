import PropTypes from "prop-types";
import React from "react";
import Panels from "./panels/PanelsEnum";
import CreateAccountPanel from "./panels/create_account/CreateAccountPanel";
import AccountPanel from "./panels/account/AccountPanel";
import SettingsPanel from "./panels/settings/SettingsPanel";
import RespawnPanel from "./panels/respawn/RespawnPanel";
import DungeonPanel from "./panels/dungeon/DungeonPanel";
import StatsPanel from "./panels/stats/StatsPanel";
import TasksPanel from "./panels/tasks/TasksPanel";
import MapPanel from "./panels/map/MapPanel";
import InventoryPanel from "./panels/inventory/InventoryPanel";
import CraftingPanel from "./panels/crafting/CraftingPanel";
import BankPanel from "./panels/bank/BankPanel";
import ShopPanel from "./panels/shop/ShopPanel";
import ChangeNamePanel from "./panels/change_name/ChangeNamePanel";

function GUIPanelWindows({ shownPanel, closePanelCallback, targetDungeonPortal }) {
    return (
        <>
            {shownPanel === Panels.CreateAccount && (
                <CreateAccountPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Account && (
                <AccountPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Settings && (
                <SettingsPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.ChangeName && (
                <ChangeNamePanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Respawn && (
                <RespawnPanel />
            )}
            {shownPanel === Panels.Dungeon && (
                <DungeonPanel
                  onCloseCallback={closePanelCallback}
                  dungeonPortal={targetDungeonPortal}
                />
            )}
            {shownPanel === Panels.Stats && (
                <StatsPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Tasks && (
                <TasksPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Map && (
                <MapPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Inventory && (
                <InventoryPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Crafting && (
                <CraftingPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Bank && (
                <BankPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
            {shownPanel === Panels.Shop && (
                <ShopPanel
                  onCloseCallback={closePanelCallback}
                />
            )}
        </>
    );
}

GUIPanelWindows.propTypes = {
    shownPanel: PropTypes.symbol,
    closePanelCallback: PropTypes.func.isRequired,
    targetDungeonPortal: PropTypes.object,
};

GUIPanelWindows.defaultProps = {
    shownPanel: null,
    targetDungeonPortal: null,
};

export default GUIPanelWindows;
