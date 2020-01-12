
const Boss = require('./Boss');

class Commander extends Boss {}
module.exports = Commander;

Commander.prototype.registerEntityType();
Commander.prototype.assignMobValues();