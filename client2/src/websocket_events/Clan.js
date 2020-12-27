// export default (eventResponses) => {

//     eventResponses.clan_joined = (data) => {
//         //console.log("clan joined, data:", data);
//         window.gameScene.clanManager.memberJoined(data);
//     };

//     // A member was kicked from the clan. Might have been this player.
//     eventResponses.clan_kicked = (data) => {
//         //console.log("clan kicked, data:", data);
//         window.gameScene.clanManager.memberKicked(data);
//     };

//     // Another member left the clan.
//     eventResponses.clan_left = (data) => {
//         //console.log("clan left, data:", data);
//         window.gameScene.clanManager.memberLeft(data);
//     };

//     eventResponses.clan_promoted = (data) => {
//         //console.log("clan promoted, data:", data);
//         window.gameScene.clanManager.promoteMember(data);
//     };

//     eventResponses.clan_destroyed = (data) => {
//         //console.log("clan destroyed, data:", data);
//         window.gameScene.clanManager.destroyed();
//     };

//     eventResponses.clan_values = (data) => {
//         //console.log("clan values, data:", data);
//         window.gameScene.GUI.clanPanel.updateValues(data);
//     };
// };
