// Default websocket object state. Used to detect if there is already a connection.
window.ws = false;

/**
 * A list of the functions to run for each event response from the server.
 * Each response can be given a generic `data` object as a parameter.
 * @type {Object}
 */
const eventResponses = {};

import EventNames from '../src/catalogues/EventNames'
import ItemTypes from '../src/catalogues/ItemTypes'
import SpellBookTypes from '../src/catalogues/SpellBookTypes'
import ChatWarnings from './catalogues/ChatWarnings'
import Utils from './Utils';

/**
 * Attempt to create a new websocket connection to the game server.
 * @param {String} url - The URL of the game server.
 * @returns {Boolean} Whether a connection already exists.
 */
function makeWebSocketConnection(url) {
    // Only connect if there isn't already a connection.
    if (ws === false) {
        // Connect to the game server.
        window.ws = new WebSocket(url);
    }
    // Connection already exists.
    else {
        // Check the if the connection is not working.
        if (ws.readyState !== 1) {
            // Close the connection.
            ws.close();
            // Try to create a new connection to the game server.
            window.ws = new WebSocket(url);
        }
        else {
            return false;
        }
    }
    return true;
}

window.connectToGameServer = function () {

    // If the game is running in dev mode (localhost), connect without SSL.
    if (window.devMode === true) {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if (makeWebSocketConnection('ws://127.0.0.4:80') === false) return false;
    }
    // Deployment mode. Connect to live server, which should be using SSL.
    else {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        //if(makeWebSocketConnection('wss://test.waywardworlds.com:3000') === false) return false;
        // if(makeWebSocketConnection('ws://142.93.54.176:3000') === false) return false;
        if (makeWebSocketConnection('wss://dungeonz.io:443') === false) return false;
    }

    /**
     * Event emit helper. Attach this to a socket, and use it to send an event to the server.
     * @param {String} eventName
     * @param {Object} [data]
     */
    ws.sendEvent = function (eventName, data) {
        this.send(JSON.stringify({ eventName: eventName, data: data }));
    };

    // Wait for the connection to have finished opening before attempting to join the world.
    ws.onopen = function () {
        // Attempt to join the world as soon as the connection is ready, so the user doesn't have to press 'Play' twice.
        playPressed();
    };

    ws.onmessage = function (event) {
        // The data is JSON, so parse it.
        const parsedMessage = JSON.parse(event.data);
        // Every event received should have an event name ID, which is a number that represents an event name string.
        // Numbers are smaller, so saves sending lengthy strings for each message.
        const eventNameID = parsedMessage.eventNameID;
        // Look up the corresponding event name string for the given ID.
        const eventName = EventNames[eventNameID];

        // Check this event name ID is in the list of valid event name IDs.
        if (eventName !== undefined) {
            // Check there is a response function to run for the event.
            if (eventResponses[eventName] !== undefined) {
                // Run the response, giving it any data.
                eventResponses[eventName](parsedMessage.data);
            }
        }

    };

    ws.onclose = function () {
        console.log('* Disconnected from game server.');
        window.ws = false;
        // Make it reload after a few seconds.
        setTimeout(function () {
            // Reload the page.
            location.reload();
        }, 6000);
    };

    ws.onerror = function (error) {
        // Get the warning text.
        let element = document.getElementById("center_text");
        // Show the server connect error message.
        element.innerText = dungeonz.getTextDef("Connect game server warning");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.style.visibility = "hidden";
        }, 8000);
    }

};

eventResponses.something_went_wrong = function () {
    // Get the warning text.
    let element = document.getElementById("center_text");
    const originalText = element.innerText;

    element.innerText = "Something went wrong... :/";

    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.innerText = originalText;
    }, 3000);
};

eventResponses.invalid_continue_code = function () {
    // Get the warning text.
    let element = document.getElementById("center_text");
    // Show the server connect error message.
    element.innerText = dungeonz.getTextDef("Invalid continue code warning");
    // Show it.
    element.style.visibility = "visible";
    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.style.visibility = "hidden";
    }, 8000);
};

eventResponses.character_in_use = function () {
    // Get the warning text.
    let element = document.getElementById("center_text");
    // Show the server connect error message.
    element.innerText = dungeonz.getTextDef("Character in use");
    // Show it.
    element.style.visibility = "visible";
    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.style.visibility = "hidden";
    }, 8000);
};

eventResponses.join_world_success = function (data) {
    Utils.message("Join world success, data:");
    Utils.message(data);

    // Hide the home screen container.
    document.getElementById("home_cont").style.display = "none";

    // If somehow the state is not valid, close the connection.
    // Weird bug... :/
    if (!_this) {
        Utils.warning("_this is invalid. Closing WS connection. _this:", _this);
        setTimeout(function () {
            ws.close();
        }, 10000);
        return;
    }

    // Keep the join world data, to pass to the game state create method.
    window.joinWorldData = data;

    // Start the game state.
    _this.scene.start("Game", true, false);

    // Really rare and annoying bug with Phaser where states aren't changing...
    // Set a timeout just in case the state refuses to start.
    // If it does start, the timeout is removed.
    window.joinWorldStartTimeout = setTimeout(function () {
        Utils.message("Backup game start starter timeout called.");
        _this.scene.start("Game", true, false);
    }, 2000);
    // Set another timeout for if even that timeout doesn't start the game state. Reload the page...
    window.joinWorldReloadTimeout = setTimeout(function () {
        location.reload(true);
    }, 5000);

    Utils.message("End of join world success");
};

eventResponses.world_full = function () {
    Utils.message("World is full.");
};

function tweenCompleteLeft() {
    _this.tilemap.shiftMapLeft();
    _this.playerTween = null;
}

function tweenCompleteRight() {
    _this.tilemap.shiftMapRight();
    _this.playerTween = null;
}

function tweenCompleteUp() {
    _this.tilemap.shiftMapUp();
    _this.playerTween = null;
}

function tweenCompleteDown() {
    _this.tilemap.shiftMapDown();
    _this.playerTween = null;
}

/**
 * Adds the event responses that relate to gameplay only once the game state has started.
 */
window.addGameStateEventResponses = function () {
    Utils.message("Adding game state event responses");

    eventResponses.create_account_success = (data) => {
        Utils.message("create_account_success");
        // Hide the create account panel.
        _this.GUI.createAccountPanel.hide();

        _this.player.isLoggedIn = true;

        _this.GUI.accountPanel.show();
    };

    eventResponses.moved = function (data) {
        //console.log("moved: ", data);

        if (_this.dynamics === undefined) {
            // Something went wrong... Reload the page.
            //location.reload();
            return;
        }

        // Get the dynamic that moved.
        const dynamic = _this.dynamics[data.id];

        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const dynamicSpriteContainer = dynamic.spriteContainer;

        // The client player moved.
        if (data.id === _this.player.entityId) {
            let origRow = _this.player.row;
            let origCol = _this.player.col;

            // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
            if (_this.playerTween !== null) {
                _this.playerTween.stop();
            }

            // Do this AFTER stopping the current player tween, so it can finish with the
            // previous position (the one that matches the state the tween starts in).
            _this.player.row = data.row;
            _this.player.col = data.col;

            dynamic.row = data.row;
            dynamic.col = data.col;

            let tweenOnCompleteFunction;

            // Right.
            if (data.col > origCol) {
                tweenOnCompleteFunction = tweenCompleteRight;
            }
            // Left.
            else if (data.col < origCol) {
                tweenOnCompleteFunction = tweenCompleteLeft;
            }
            // Down.
            if (data.row > origRow) {
                tweenOnCompleteFunction = tweenCompleteDown;
            }
            // Up.
            else if (data.row < origRow) {
                tweenOnCompleteFunction = tweenCompleteUp;
            }

            _this.checkDynamicsInViewRange();
            _this.tilemap.updateDarknessGrid();
            _this.tilemap.updateDarknessGridPosition();

            // Tween the player sprite to the target row/col.
            _this.playerTween = _this.tweens.add({
                targets: dynamicSpriteContainer,
                duration: _this.moveDelay,
                x: data.col * dungeonz.SCALED_TILE_SIZE,
                y: data.row * dungeonz.SCALED_TILE_SIZE,
                onComplete: tweenOnCompleteFunction,
                // Need to do stop callback too in case the tween hasn't finished
                // yet, as calling Tween.stop() then doesn't call onComplete.
                onStop: tweenOnCompleteFunction
            });

            // Check for any interactables that are now in range to be interacted with.
            const
                interactables = _this.interactables,
                interactionRange = 4;
            let interactable;

            for (let key in interactables) {
                if (interactables.hasOwnProperty(key) === false) continue;
                interactable = interactables[key];

                const distFromPlayer =
                    Math.abs(interactable.row - dynamic.row) +
                    Math.abs(interactable.col - dynamic.col);

                if (distFromPlayer <= interactionRange) {
                    interactable.highlightSprite.setVisible(true);

                    if (interactable.isWithinPressableRange()) {
                        interactable.highlightSprite.setAlpha(1);
                        interactable.highlightSprite.setScale(1.2);
                    }
                    else {
                        interactable.highlightSprite.setAlpha(0.6);
                        interactable.highlightSprite.setScale(1);
                    }
                }
                else {
                    interactable.highlightSprite.setVisible(false);
                }
            }

        }
        // Another entity moved.
        else {
            //console.log("moving other entity:", data.id);

            // Get the boundaries of the player view range.
            let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
            let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
            let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
            let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

            dynamic.row = data.row;
            dynamic.col = data.col;

            // Check if it is still within the player view range.
            if (dynamic.row < playerRowTopViewRange
                || dynamic.row > playerRowBotViewRange
                || dynamic.col < playerColLeftViewRange
                || dynamic.col > playerColRightViewRange) {
                // Out of view range. Remove it.
                dynamicSpriteContainer.destroy();
                // Remove the reference to it.
                delete _this.dynamics[dynamic.id];
                return;
            }

            // Tween to the new location.
            if (dynamicSpriteContainer.centered === true) {
                _this.tweens.add({
                    targets: dynamicSpriteContainer,
                    duration: 250, //TODO: get the move rate of each dynamic, and use this here (250) for smoother timing
                    x: (data.col * dungeonz.SCALED_TILE_SIZE) + dungeonz.CENTER_OFFSET,
                    y: (data.row * dungeonz.SCALED_TILE_SIZE) + dungeonz.CENTER_OFFSET,
                });
            }
            else {
                _this.tweens.add({
                    targets: dynamicSpriteContainer,
                    duration: 250,
                    x: data.col * dungeonz.SCALED_TILE_SIZE,
                    y: data.row * dungeonz.SCALED_TILE_SIZE
                });
            }
        }

        // If the dynamic does something extra when it moves, do it.
        if (dynamicSpriteContainer.onMove !== undefined) dynamicSpriteContainer.onMove(true);

        // Move sprites further down the screen above ones further up.
        _this.dynamicSpritesContainer.list.forEach((dynamicSpriteContainer) => {
            dynamicSpriteContainer.z = dynamicSpriteContainer.y;
        });
    };

    eventResponses.start_dungeon = (data) => {
        _this.GUI.startDungeonTimer(data.timeLimitMinutes);
    };

    eventResponses.change_board = function (data) {
        //console.log("change board, data:", data);
        _this.dynamicsData = data.dynamicsData;
        _this.boardAlwaysNight = data.boardAlwaysNight;
        _this.player.row = data.playerRow;
        _this.player.col = data.playerCol;

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            _this.GUI.stopDungeonTimer();
            _this.GUI.updateDungeonKeysList({});
        }

        /* TODO if(_this.boardAlwaysNight === false){
            // Make the darkness layer invisible during day time.
            if(_this.dayPhase === _this.DayPhases.Day){
                let row,
                    col,
                    darknessSpritesGrid = _this.tilemap.darknessSpritesGrid;
    
                for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
                    for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                        darknessSpritesGrid[row][col].alpha = 0;
                    }
                }
            }
        }*/

        // Load the map with the given board name.
        _this.tilemap.loadMap(data.boardName);

        // Remove the old entities.
        const dynamics = _this.dynamics;
        for (let key in dynamics) {
            if (dynamics.hasOwnProperty(key) === false) continue;
            _this.removeDynamic(key);
        }

        // Add the new entities.
        const dynamicsData = _this.dynamicsData;
        for (let i = 0; i < dynamicsData.length; i += 1) {
            _this.addEntity(dynamicsData[i]);
        }

        // Lock the camera to the player sprite.
        _this.cameras.main.startFollow(_this.dynamics[_this.player.entityId].spriteContainer);

        // Refresh the darkness grid.
        _this.tilemap.updateDarknessGrid();

        // Hide any open panels.
        _this.GUI.hideAllPanels();
    };

    eventResponses.change_day_phase = function (data) {
        //console.log("changing day phase:", data);
        _this.dayPhase = data;

        if (_this.boardAlwaysNight === false) {
            // Make the darkness layer invisible during day time.
            if (_this.dayPhase === _this.DayPhases.Day) {
                let row,
                    col,
                    darknessSpritesGrid = _this.tilemap.darknessSpritesGrid;

                for (row = 0; row < dungeonz.VIEW_DIAMETER; row += 1) {
                    for (col = 0; col < dungeonz.VIEW_DIAMETER; col += 1) {
                        darknessSpritesGrid[row][col].alpha = 0;
                    }
                }
            }
        }

        _this.tilemap.updateDarknessGrid();
    };

    eventResponses.hit_point_value = function (data) {
        _this.player.hitPoints = data;
        if (_this.player.hitPoints <= 0) {
            _this.GUI.respawnPanel.show();
        }
        _this.GUI.updateHitPointCounters();
    };

    eventResponses.energy_value = function (data) {
        _this.player.energy = data;
        _this.GUI.updateEnergyCounters();
    };

    eventResponses.defence_value = function (data) {
        _this.player.defence = data;
        _this.GUI.updateDefenceCounters();
    };

    eventResponses.glory_value = function (data) {
        _this.GUI.updateGloryCounter(data);
    };

    eventResponses.durability_value = function (data) {
        //console.log("durability_value:", data);
        _this.player.inventory[data.slotKey].updateDurability(data.durability);
    };

    eventResponses.heal = function (data) {
        _this.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.damage = function (data) {
        _this.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.effect_start_burn = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onBurnStart();
    };

    eventResponses.effect_stop_burn = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onBurnStop();
    };

    eventResponses.effect_start_poison = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onPoisonStart();
    };

    eventResponses.effect_stop_poison = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onPoisonStop();
    };

    eventResponses.effect_start_health_regen = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onHealthRegenStart();
    };

    eventResponses.effect_stop_health_regen = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onHealthRegenStop();
    };

    eventResponses.effect_start_energy_regen = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onEnergyRegenStart();
    };

    eventResponses.effect_stop_energy_regen = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onEnergyRegenStop();
    };

    eventResponses.effect_start_cured = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onCuredStart();
    };

    eventResponses.effect_stop_cured = function (data) {
        if (_this.dynamics[data] === undefined) return;
        _this.dynamics[data].spriteContainer.onCuredStop();
    };

    eventResponses.player_respawn = function () {
        _this.player.hitPoints = _this.player.maxHitPoints;
        _this.player.energy = _this.player.maxEnergy;
        _this.GUI.respawnPanel.hide();
        _this.GUI.updateHitPointCounters();
        _this.GUI.updateEnergyCounters();
    };

    eventResponses.add_entity = function (data) {
        //console.log("add entity event:", data);
        if (_this.addEntity === undefined) return;
        _this.addEntity(data);
    };

    eventResponses.remove_entity = function (data) {
        //console.log("remove entity event:", data);
        _this.removeDynamic(data);
    };

    eventResponses.add_entities = function (data) {
        //console.log("add entities event");
        for (let i = 0; i < data.length; i += 1) {
            _this.addEntity(data[i]);
        }
    };

    eventResponses.add_item = function (data) {
        //console.log("add item event:", data);
        _this.player.inventory[data.slotKey].fill(ItemTypes[data.typeNumber], data.durability, data.maxDurability);
    };

    eventResponses.remove_item = function (data) {
        //console.log("remove item event:", data);
        _this.player.inventory[data].empty();
    };

    eventResponses.equip_clothes = function (data) {
        const clothes = _this.dynamics[data.id].spriteContainer.clothes;
        clothes.visible = true;
        clothes.clothesName = ItemTypes[data.typeNumber].idName;
        clothes.setFrame(clothes.clothesFrames[clothes.clothesName][clothes.parent.direction]);
    };

    eventResponses.unequip_clothes = function (data) {
        //console.log("unequip clothes:", data);
        _this.dynamics[data].spriteContainer.clothes.visible = false;
    };

    eventResponses.activate_ammunition = function (data) {
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/ammunition-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
    };

    eventResponses.deactivate_ammunition = function (data) {
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_clothing = function (data) {
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/clothing-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
    };

    eventResponses.deactivate_clothing = function (data) {
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_holding = function (data) {
        _this.player.holdingItem = true;
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/holding-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
        // Change the cursor to the attack icon.
        _this.GUI.gui.className = "attack_cursor";
    };

    eventResponses.deactivate_holding = function (data) {
        _this.player.holdingItem = false;
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
        _this.GUI.spellBar.hide();
        // Change the cursor to the normal icon.
        _this.GUI.gui.className = "normal_cursor";
    };

    /**
     *
     * @param data - The type number of the spell book being held.
     */
    eventResponses.activate_spell_book = function (data) {
        _this.GUI.spellBar.changeSpellBook(data[1]);
        _this.GUI.spellBar.show();
    };

    eventResponses.bank_item_deposited = function (data) {
        //console.log("bank_item_deposited, data:", data);
        _this.player.bankManager.addItemToContents(data.slotIndex, ItemTypes[data.typeNumber], data.durability, data.maxDurability);
    };

    eventResponses.bank_item_withdrawn = function (data) {
        //console.log("bank_item_withdrawn, data:", data);
        _this.player.bankManager.removeItemFromContents(data);
    };

    eventResponses.active_state = function (data) {
        //console.log("active state change:", data);
        _this.tilemap.updateStaticTile(data, true);
    };

    eventResponses.inactive_state = function (data) {
        //console.log("inactive state change:", data);
        _this.tilemap.updateStaticTile(data, false);
    };

    eventResponses.change_direction = function (data) {
        //console.log("change_direction:", data);
        // Check the entity id is valid.
        const dynamic = _this.dynamics[data.id];
        if (dynamic === undefined) return;

        const spriteContainer = dynamic.spriteContainer;
        // Some sprites show their direction by having different frames, others by rotating.
        if (spriteContainer.baseFrames !== undefined) {
            spriteContainer.baseSprite.setFrame(spriteContainer.baseFrames[data.direction]);
        }
        if (spriteContainer.directionAngles !== undefined) {
            spriteContainer.angle = spriteContainer.directionAngles[data.direction];
        }
        if (spriteContainer.clothes !== undefined) {
            spriteContainer.clothes.setFrame(spriteContainer.clothes.clothesFrames[spriteContainer.clothes.clothesName][data.direction]);
            spriteContainer.clothes.anims.stop();
        }
        spriteContainer.direction = data.direction;
        spriteContainer.onChangeDirection();
    };

    eventResponses.curse_set = function (data) {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.curseIcon.visible = true;
    };

    eventResponses.curse_removed = function (data) {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.curseIcon.visible = false;
    };

    eventResponses.enchantment_set = function (data) {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.enchantmentIcon.visible = true;
    };

    eventResponses.enchantment_removed = function (data) {
        const dynamic = _this.dynamics[data];
        if (dynamic === undefined) return;
        dynamic.spriteContainer.enchantmentIcon.visible = false;
    };

    eventResponses.chat = function (data) {
        //console.log("chat:", data);
        _this.chat(data.id, data.message);
    };

    eventResponses.chat_warning = function (data) {
        _this.chat(undefined, dungeonz.getTextDef(ChatWarnings[data]), "#ffa54f");
    };

    eventResponses.cannot_drop_here = function () {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Drop item blocked warning"));
    };

    eventResponses.item_broken = function () {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Item broken warning"));
    };

    eventResponses.inventory_full = function () {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Inventory full warning"));
    };

    eventResponses.hatchet_needed = function () {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Hatchet needed warning"));
    };

    eventResponses.pickaxe_needed = function () {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Pickaxe needed warning"));
    };

    eventResponses.exp_gained = function (data) {
        //console.log("exp gained, data:", data);
        _this.player.stats.list[data.statName].modExp(data.exp);
    };

    eventResponses.stat_levelled = function (data) {
        //console.log("stat levelled, data:", data);
        _this.player.stats.list[data.statName].levelUp(data.level, data.nextLevelExpRequirement);
    };

    eventResponses.parties = function (data) {
        _this.GUI.dungeonPanel.updateParties(data);
    };

    eventResponses.dungeon_door_keys = (data) => {
        _this.GUI.updateDungeonKeysList(data);
    };

    eventResponses.shop_prices = function (data) {
        //console.log("shop prices, data:", data);
        _this.GUI.shopPanel.updatePrices(data);
    };

    eventResponses.clan_joined = function (data) {
        //console.log("clan joined, data:", data);
        _this.clanManager.memberJoined(data);
    };

    // A member was kicked from the clan. Might have been this player.
    eventResponses.clan_kicked = function (data) {
        //console.log("clan kicked, data:", data);
        _this.clanManager.memberKicked(data);
    };

    // Another member left the clan.
    eventResponses.clan_left = function (data) {
        //console.log("clan left, data:", data);
        _this.clanManager.memberLeft(data);
    };

    eventResponses.clan_promoted = function (data) {
        //console.log("clan promoted, data:", data);
        _this.clanManager.promoteMember(data);
    };

    eventResponses.clan_destroyed = function (data) {
        //console.log("clan destroyed, data:", data);
        _this.clanManager.destroyed();
    };

    eventResponses.clan_values = function (data) {
        //console.log("clan values, data:", data);
        _this.GUI.clanPanel.updateValues(data);
    };

    eventResponses.task_progress_made = function (data) {
        //console.log("task progresss made, data:", data);
        _this.GUI.tasksPanel.updateTaskProgress(data.taskID, data.progress);
    };

    eventResponses.task_claimed = function (data) {
        //console.log("task claimed, data:", data);
        _this.GUI.tasksPanel.removeTask(data);
    };

    eventResponses.task_added = function (data) {
        //console.log("task added, data:", data);
        if (_this.GUI === undefined) return;

        _this.GUI.tasksPanel.addTask(data);
    };

};