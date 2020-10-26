const Static = require('./Static');

class Solid extends Static {}

module.exports = Solid;

Solid.prototype._lowBlocked = true;
Solid.prototype._highBlocked = true;