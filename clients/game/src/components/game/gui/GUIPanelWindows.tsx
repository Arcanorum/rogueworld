import Panels from './panels/Panels';
import CreateAccountPanel from './panels/create_account/CreateAccountPanel';
import AccountPanel from './panels/account/AccountPanel';
import SettingsPanel from './panels/settings/SettingsPanel';
import RespawnPanel from './panels/respawn/RespawnPanel';
// import DungeonPanel from './panels/dungeon/DungeonPanel';
// import StatsPanel from './panels/stats/StatsPanel';
// import TasksPanel from './panels/tasks/TasksPanel';
import dynamic, { DynamicOptions } from 'next/dynamic';
const MapPanel = dynamic(
    ((() => import('./panels/map/MapPanel')) as DynamicOptions),
    { ssr: false },
);
// import LeaveDungeonPanel from './panels/leave_dungeon/LeaveDungeonPanel';
import InventoryPanel from './panels/inventory/InventoryPanel';
import CraftingPanel from './panels/crafting/CraftingPanel';
// import BankPanel from './panels/bank/BankPanel';
import ShopPanel from './panels/shop/ShopPanel';
import ChangeNamePanel from './panels/change_name/ChangeNamePanel';

function GUIPanelWindows({
    shownPanel,
    closePanelCallback,
}: {
    shownPanel?: Panels;
    closePanelCallback: () => void;
}) {
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
            {/* {shownPanel === Panels.Dungeon && (
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
            )} */}
            {shownPanel === Panels.Map && (
                <MapPanel
                    onCloseCallback={closePanelCallback}
                />
            )}
            {/* {shownPanel === Panels.LeaveDungeon && (
                <LeaveDungeonPanel
                    onCloseCallback={closePanelCallback}
                />
            )} */}
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
            {/* {shownPanel === Panels.Bank && (
                <BankPanel
                    onCloseCallback={closePanelCallback}
                />
            )} */}
            {shownPanel === Panels.Shop && (
                <ShopPanel
                    onCloseCallback={closePanelCallback}
                />
            )}
        </>
    );
}

export default GUIPanelWindows;
