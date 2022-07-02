module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        indent: [
            'error',
            4,
        ],
        // 'space-infix-ops': [
        //     'error',
        //     { 'int32Hint': false },
        // ],
    },

    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                'airbnb-base',
                'airbnb-typescript/base',
            ],
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                "@typescript-eslint/indent": [
                    "error",
                    4
                ],
                '@typescript-eslint/brace-style': [
                    'warn',
                    'stroustrup',
                    { allowSingleLine: true },
                ],
                'no-new': [
                    'off',
                ],
                'import/no-cycle': [
                    'off',
                ],
                'import/no-extraneous-dependencies': [
                    'off',
                ],
                'no-underscore-dangle': [
                    'off',
                ],
                'no-unused-vars': [
                    'warn',
                ],
                'class-methods-use-this': [
                    'warn',
                ],
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                ],
                'no-param-reassign': [
                    'warn',
                ],
                'prefer-destructuring': [
                    'warn',
                ]
            }
        }
    ],
    env: {
        es6: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
