// PM2 config
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
    apps: [
        {
            name: 'Push webhook',
            script: './git-webhook.js',
            watch: ['./git-webhook.js'],
            // GitHub webhook secret
            args: 'test',
            exp_backoff_restart_delay: 1000,
        },
    ],
};
