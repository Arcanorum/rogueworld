
//class TaskProgress {
//    /**
//     * @param {Player} player - The entity of the player that this task is assigned to.
//     * @param {Task} task - The task to track the progress of.
//     * @param {Number} [progress] - How far along this task is the player already.
//     */
//    constructor (player, task, progress) {
//        /** @type {Player} */
//        this.player = player;
//        /** @type {Task} */
//        this.task = task;
//        /** @type {Boolean} */
//        this.completed = false;
//        /** @type {Number} */
//        this.progress = progress || 0;
//        // Check this task is completed. They might have completed it before, but not claimed it.
//        if(this.progress >= this.task.completionThreshold){
//            this.completed = true;
//        }
//    }
//
//    progressMade () {
//        if(this.completed === true) return;
//        this.progress += 1;
//        // Tell the player they have made progress on the task.
//        // The client can work out whether it has been completed.
//        this.player.socket.sendEvent(EventsList.task_progress_made, {taskID: this.task.taskID, progress: this.progress});
//        if(this.progress >= this.task.completionThreshold){
//            this.completed = true;
//        }
//        //console.log("task progress made:", this.task.taskID, ", val:", this.progress);
//    }
//
//    claimReward () {
//        //console.log("claiming reward:", this.task.taskID);
//        if(this.completed === false) return;
//
//        // Remove this task from the player's task list.
//        delete this.player.tasks.list[this.task.taskID];
//
//        // Give them the rewards.
//        this.player.modGlory(this.task.reward.glory);
//
//        const rewardItemTypes = this.task.reward.itemTypes;
//        for(let i=0; i<rewardItemTypes.length; i+=1){
//            // If they have enough inventory space to claim this reward, add to the inventory.
//            if(this.player.isInventoryFull() === false){
//                this.player.addToInventory(new rewardItemTypes[i]({}));
//            }
//            // Otherwise add it to the ground.
//            else {
//                new rewardItemTypes[i].prototype.PickupType({row: this.player.row, col: this.player.col, board: this.player.board}).emitToNearbyPlayers();
//            }
//        }
//        // Tell the client to remove this task from the list.
//        this.player.socket.sendEvent(EventsList.task_claimed, this.task.taskID);
//
//        // NOTE: Might be weirdness here, doing it after deletion.
//        this.task.onClaimed(this.player);
//    }
//
//}
//
//module.exports = TaskProgress;
//
//const EventsList = require('./../EventsList');