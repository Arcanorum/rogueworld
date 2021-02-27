// export default (eventResponses) => {

//     eventResponses.clan_joined = (data) => {
//         //console.log("clan joined, data:", data);
//         dungeonz.gameScene.clanManager.memberJoined(data);
//     };

//     // A member was kicked from the clan. Might have been this player.
//     eventResponses.clan_kicked = (data) => {
//         //console.log("clan kicked, data:", data);
//         dungeonz.gameScene.clanManager.memberKicked(data);
//     };

//     // Another member left the clan.
//     eventResponses.clan_left = (data) => {
//         //console.log("clan left, data:", data);
//         dungeonz.gameScene.clanManager.memberLeft(data);
//     };

//     eventResponses.clan_promoted = (data) => {
//         //console.log("clan promoted, data:", data);
//         dungeonz.gameScene.clanManager.promoteMember(data);
//     };

//     eventResponses.clan_destroyed = (data) => {
//         //console.log("clan destroyed, data:", data);
//         dungeonz.gameScene.clanManager.destroyed();
//     };

//     eventResponses.clan_values = (data) => {
//         //console.log("clan values, data:", data);
//         dungeonz.gameScene.GUI.clanPanel.updateValues(data);
//     };
// };
