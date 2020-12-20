const Utils = require("./Utils");

var counter = 0;
function registerEventName() {
    counter += 1;
    //Utils.message("Registering event name, ID: ", counter);
    return counter;
}

const EventsList = {
    moved: registerEventName(),
    add_entity: registerEventName(),
    change_direction: registerEventName(),
    active_state: registerEventName(),
    activate_ammunition: registerEventName(),
    activate_clothing: registerEventName(),
    activate_holding: registerEventName(),
    activate_spell_book: registerEventName(),
    add_entities: registerEventName(),
    add_item: registerEventName(),
    bank_item_deposited: registerEventName(),
    bank_item_withdrawn: registerEventName(),
    breakable_broken: registerEventName(),
    breakable_damaged: registerEventName(),
    breakable_repaired: registerEventName(),
    cannot_drop_here: registerEventName(),
    chat: registerEventName(),
    chat_warning: registerEventName(),
    change_board: registerEventName(),
    change_day_phase: registerEventName(),
    character_in_use: registerEventName(),
    change_password_failure: registerEventName(),
    change_password_success: registerEventName(),
    clan_destroyed: registerEventName(),
    clan_joined: registerEventName(),
    clan_left: registerEventName(),
    clan_promoted: registerEventName(),
    clan_kicked: registerEventName(),
    clan_values: registerEventName(),
    create_account_failure: registerEventName(),
    create_account_success: registerEventName(),
    curse_set: registerEventName(),
    curse_removed: registerEventName(),
    damage: registerEventName(),
    deactivate_ammunition: registerEventName(),
    deactivate_clothing: registerEventName(),
    deactivate_holding: registerEventName(),
    defence_value: registerEventName(),
    drop_item: registerEventName(),
    durability_value: registerEventName(),
    dungeon_door_keys: registerEventName(),
    dungeon_prompt: registerEventName(),
    effect_start_burn: registerEventName(),
    effect_stop_burn: registerEventName(),
    effect_start_poison: registerEventName(),
    effect_stop_poison: registerEventName(),
    effect_start_disease: registerEventName(),
    effect_stop_disease: registerEventName(),
    effect_start_health_regen: registerEventName(),
    effect_stop_health_regen: registerEventName(),
    effect_start_energy_regen: registerEventName(),
    effect_stop_energy_regen: registerEventName(),
    effect_start_cured: registerEventName(),
    effect_stop_cured: registerEventName(),
    energy_value: registerEventName(),
    enchantment_set: registerEventName(),
    enchantment_removed: registerEventName(),
    equip_clothes: registerEventName(),
    unequip_clothes: registerEventName(),
    exp_gained: registerEventName(),
    glory_value: registerEventName(),
    gold_exchange_rate: registerEventName(),
    hatchet_needed: registerEventName(),
    heal: registerEventName(),
    hit_point_value: registerEventName(),
    invalid_login_details: registerEventName(),
    inactive_state: registerEventName(),
    item_broken: registerEventName(),
    item_dropped: registerEventName(),
    item_used: registerEventName(),
    inventory_full: registerEventName(),
    join_world_success: registerEventName(),
    key_needed: registerEventName(),
    parties: registerEventName(),
    pickaxe_needed: registerEventName(),
    player_died: registerEventName(),
    player_respawn: registerEventName(),
    remove_entity: registerEventName(),
    remove_item: registerEventName(),
    shop_prices: registerEventName(),
    something_went_wrong: registerEventName(),
    start_dungeon: registerEventName(),
    stat_levelled: registerEventName(),
    task_added: registerEventName(),
    task_claimed: registerEventName(),
    task_progress_made: registerEventName(),
    username_taken: registerEventName(),
    world_full: registerEventName(),
};

// Write the event names to the client, so the client knows what event to fire for each event ID.
const fs = require("fs");
let dataToWrite = {};

for (let eventTypeKey in EventsList) {
    // Don't check prototype properties.
    if (EventsList.hasOwnProperty(eventTypeKey) === false) continue;
    // Add this event name to the catalogue.
    // The ID number of the event will be the key, and the key (the event name) will be the value.
    dataToWrite[EventsList[eventTypeKey]] = eventTypeKey;
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

Utils.checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync("../client/src/catalogues/EventNames.json", dataToWrite);

Utils.message("Event names catalogue written to file.");

module.exports = EventsList;