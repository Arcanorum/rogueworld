const Breakable = require('./Breakable');

class Torch extends Breakable {}

module.exports = Torch;

Torch.prototype._lowBlocked = true;
Torch.prototype._highBlocked = true;