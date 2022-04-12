// PM2 config
// https://pm2.keymetrics.io/docs/usage/application-declaration/
// --transpile-only flag to reduce memory overhead.
// https://stackoverflow.com/a/65789609/3213175

// Add any services that the game depends on to this list.
// How this file is configured depends on the deployment setup.
// This example makes everything run on the same server.
// If you have some services running elsewhere, then add them to this file on their respective server.

module.exports = {
    apps: [
        {
            name: 'Game service',
            script: 'npm',
            args: 'run prod -w services/game',
            exp_backoff_restart_delay: 1000,
        },
        {
            name: 'Map service',
            script: 'npm',
            args: 'run prod -w services/map',
            exp_backoff_restart_delay: 1000,
        },
    ],
};
