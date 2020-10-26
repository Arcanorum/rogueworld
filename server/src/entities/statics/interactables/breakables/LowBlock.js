const Breakable = require('./Breakable');

class LowBlock extends Breakable {}

module.exports = LowBlock;

LowBlock.prototype._lowBlocked = true;
LowBlock.prototype._highBlocked = false;