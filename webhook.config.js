// PM2 config
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
    apps: [
        {
            name: 'Push webhook',
            script: 'npx',
            args: 'ts-node --transpile-only ./git-webhook.ts',
            watch: ['./git-webhook.ts'],
            exp_backoff_restart_delay: 1000,
        },
    ],
};
