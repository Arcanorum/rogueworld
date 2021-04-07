const Breakable = require("./Breakable");

class Wall extends Breakable {}

module.exports = Wall;

Wall.prototype._lowBlocked = true;
Wall.prototype._highBlocked = true;
