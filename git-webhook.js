const crypto = require('crypto');
const http = require('http');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const port = 3333;
const secret = process.argv[2];

if (secret) {
    console.log('Secret provided. Requests will be checked before restarting the game.');
}
else {
    console.log('No secret provided! Any requests will restart the game.');
}

/**
 * TODO: doc this
 */

http.createServer(function(req, res) {
    console.log('Request received');

    req.on('data', async function(chunk) {
        console.log('Data event');

        if (secret) {
            console.log('Secret provided, checking signature');
            let sig = `sha1=${crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')}`;

            console.log('sig:', sig);
            console.log('x-hub-signature:', req.headers['x-hub-signature']);

            if (req.headers['x-hub-signature'] !== sig) return;
        }

        try {
            console.log('Pulling from git');
            await exec('git pull');
            console.log('Done');

            console.log('Installing packages');
            // Do a "clean install" to avoid arbitrary changes to package-lock.json which would
            // prevent further git pulls due to uncommitted changes in that file.
            // https://stackoverflow.com/questions/45022048/why-does-npm-install-rewrite-package-lock-json
            await exec('npm ci');
            console.log('Done');

            console.log('Building game client');
            await exec('cd ./clients/game && npm run build');
            console.log('Done');

            console.log('Restarting services');
            await exec('pm2 restart services.config.js');
            console.log('Done');

            console.log('Building map tiles');
            // Do this at the end so everything else is running while the map is building.
            await exec('cd ./services/map && npm run build');
            console.log('Done');
        }
        catch (err) {
            console.error(err);
        }
    });

    res.end();
}).listen(port);

console.log(`Listening on port ${port} for webhook events.`);
