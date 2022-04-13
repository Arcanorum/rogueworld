const crypto = require('crypto');
const http = require('http');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const port = 3333;
const secret = process.argv[2];

console.log('Starting REST server for git webhook listeners.');

if (secret) {
    console.log('Secret provided. Requests will be checked before restarting the game.');
}
else {
    console.log('No secret provided! Any requests will restart the game.');
}

async function restart() {
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
    await exec('npm run build -w clients/game');
    console.log('Done');

    console.log('Restarting services');
    await exec('pm2 restart services.config.js');
    console.log('Done');

    // TODO: this really doesn't want to work... keeps crashing on the headless server when ran
    // like this, but running `npm run build -w services/map` in the terminal directly works...
    // console.log('Building map tiles');
    // // Do this at the end so everything else is running while the map is building.
    // await exec('npm run build -w services/map');
    // console.log('Done');
}

/**
 * The PM2 file watcher should restart this REST app when this file changes, such as when doing a git pull.
 * This comes with the problem that this app might be in the middle of restarting the game (i.e. building
 * the client) when it is restarted by PM2, so won't be able to finish each step.
 * So just run the game restart process on startup to make sure it runs through everything again from
 * the start in case this app was restarted part way through.
 */
restart();

/**
 * A basic continuous integration setup that create a REST server that listens for any git push
 * webhook events sent by GitHub.
 * Used to trigger a restart of the game every time a commit is pushed, so it is up to date with
 * the latest code.
 */
http.createServer(function(req, res) {
    console.log('Request received');

    req.on('data', async function(chunk) {
        console.log('Data event');

        try {
            if (secret) {
                console.log('Secret provided, checking signature');
                let sig = `sha1=${crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')}`;

                if (req.headers['x-hub-signature'] !== sig) {
                    console.log('Invalid secret, skipping');
                    return;
                }
            }

            await restart();
        }
        catch (err) {
            console.error(err);
        }
    });

    res.end();
}).listen(port);

console.log(`Listening on port ${port} for webhook events.`);
