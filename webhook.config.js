// PM2 config
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
    apps: [
        {
            name: 'Push webhook',
            script: 'npm',
            args: 'run git-webhook',
            watch: ['./git-webhook.ts'],
            exp_backoff_restart_delay: 1000,
        },
    ],
};
