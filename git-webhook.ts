import { Settings } from '@dungeonz/configs';
import { message } from '@dungeonz/utils';
import crypto from 'crypto';
import { createServer } from 'http';
import util from 'util';

const exec = util.promisify(require('child_process').exec);
const port = Settings.GIT_WEBHOOK_PORT || 3333;
const branchName = Settings.GIT_WEBHOOK_BRANCH_NAME || '';
const secret = Settings.GIT_WEBHOOK_SECRET || '';
const refName = branchName ? `refs/heads/${branchName}` : '';

message('Starting REST server for git webhook listeners.');

if (secret) {
    message('Secret provided. Requests will be checked before restarting the game.');
}
else {
    message('No secret provided! Any requests will restart the game.');
}

async function restart() {
    message(`Checking out git branch: ${branchName}`);
    await exec(`git checkout ${branchName}`);
    message('Done');

    message('Pulling from git');
    await exec('git pull');
    message('Done');

    message('Installing packages');
    // Do a "clean install" to avoid arbitrary changes to package-lock.json which would
    // prevent further git pulls due to uncommitted changes in that file.
    // https://stackoverflow.com/questions/45022048/why-does-npm-install-rewrite-package-lock-json
    await exec('npm ci');
    message('Done');

    message('Building game client');
    await exec('npm run build -w clients/game');
    message('Done');

    message('Restarting services');
    await exec('pm2 restart services.config.js');
    message('Done');

    message('Building map tiles');
    // Do this at the end so everything else is running while the map is building.
    await exec('npm run build -w services/map');
    message('Done');
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
createServer(function(req, res) {
    message('Request received');

    req.on('data', async function(chunk) {
        const data = JSON.parse(chunk.toString());
        message('Triggered by payload data:', data);

        try {
            // Github sends events for all branches that are pushed to, so need to check the specific one that was updated.
            if(refName && refName !== data.ref) return;

            if(req === branchName) {
                if (secret) {
                    message('Secret provided, checking signature');
                    const sig = `sha1=${crypto
                        .createHmac('sha1', secret)
                        .update(chunk.toString())
                        .digest('hex')
                    }`;

                    if (req.headers['x-hub-signature'] !== sig) {
                        message('Invalid secret, skipping');
                        return;
                    }
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

message(`Listening on port ${port} for webhook events for branch '${branchName}'.`);
