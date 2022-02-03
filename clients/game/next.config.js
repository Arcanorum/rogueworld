const withTM = require('next-transpile-modules')([ '@dungeonz/utils' ]);

module.exports = withTM({
    // https://github.com/vercel/next.js/issues/7755#issuecomment-916022379
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        config.module.rules.push({
            test: /\.(mp3|ogg|opus)$/i,
            type: 'asset/resource',
        });

        return config;
    },
});
