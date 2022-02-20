module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        'import',
    ],
    extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        indent: [
            'error',
            4,
        ],
        'max-len': [
            'error',
            {
                code: 100,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        'no-unused-vars': [
            'error',
        ],
        'no-param-reassign': [
            'off',
        ],
        'no-new': [
            'off',
        ],
        'import/no-dynamic-require': [
            'off',
        ],
        'class-methods-use-this': [
            'off',
        ],
        'max-classes-per-file': [
            'off',
        ],
        quotes: [
            'error',
            'single',
        ],
        'brace-style': [
            'warn',
            'stroustrup',
            { allowSingleLine: true },
        ],
        'linebreak-style': [
            'off',
        ],
        'no-underscore-dangle': [
            'off',
        ],
        'import/no-unresolved': [
            'error',
        ],
        'import/no-extraneous-dependencies': [
            'off',
        ],
        'react/react-in-jsx-scope': [
            'off',
        ],
        semi: [
            'error',
            'always',
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'eol-last': [
            'error',
            'always',
        ],
        'block-spacing': [
            'error',
            'always',
        ],
        'no-multi-spaces': [
            'error',
        ],
        'no-trailing-spaces': [
            'error',
        ],
        'space-infix-ops': [
            'error',
            { 'int32Hint': false },
        ],
        'template-curly-spacing': [
            'error',
            'never',
        ],
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'array-bracket-spacing': [
            'error',
            'never',
        ],
        'padded-blocks': [
            'error',
            'never',
        ],
        'prefer-template': [
            'error',
        ],
        'comma-spacing': [
            'error',
        ],
        'object-shorthand': [
            'error',
        ],
        'space-before-blocks': [
            'error',
        ],
        'space-before-function-paren': [
            'error',
            'never',
        ],
        'space-in-parens': [
            'error',
        ],
        'key-spacing': [
            'error',
        ],
        'arrow-spacing': [
            'error',
        ],
        'no-multiple-empty-lines': [
            'error',
        ],
        '@typescript-eslint/semi': [
            'error',
        ],
        '@typescript-eslint/no-var-requires': [
            'off',
        ],
        '@typescript-eslint/member-delimiter-style': [
            'warn',
            {
                'multiline': {
                    'delimiter': 'semi',
                    'requireLast': true,
                },
                'singleline': {
                    'delimiter': 'semi',
                    'requireLast': false,
                },
            },
        ],
    },
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
