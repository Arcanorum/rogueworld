const a11yOff = Object.keys(require("eslint-plugin-jsx-a11y").rules)
    .reduce((acc, rule) => {
        acc[`jsx-a11y/${rule}`] = "off"; return acc;
    }, {});

module.exports = {
    extends: "airbnb",
    parser: "babel-eslint",
    ignorePatterns: [
        "**/build/*",
    ],
    rules: {
        ...a11yOff,
        indent: [
            "error",
            4,
            {
                ignoredNodes: [
                    "JSXElement",
                    "JSXElement > *",
                    "JSXAttribute",
                    "JSXIdentifier",
                    "JSXNamespacedName",
                    "JSXMemberExpression",
                    "JSXSpreadAttribute",
                    "JSXExpressionContainer",
                    "JSXOpeningElement",
                    "JSXClosingElement",
                    "JSXText",
                    "JSXEmptyExpression",
                    "JSXSpreadChild",
                ],
            },
        ],
        "max-len": [
            "error",
            {
                code: 150,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        "no-unused-vars": [
            "warn",
        ],
        "no-param-reassign": [
            "off",
        ],
        "class-methods-use-this": [
            "off",
        ],
        "max-classes-per-file": [
            "off",
        ],
        quotes: [
            "error",
            "double",
        ],
        "brace-style": [
            "warn",
            "stroustrup",
            { allowSingleLine: true },
        ],
        "linebreak-style": [
            "off",
        ],
        "import/no-unresolved": [
            "error",
        ],
        "import/no-extraneous-dependencies": [
            "off",
        ],
        "react/jsx-filename-extension": [
            "warn",
            {
                extensions: [
                    ".js",
                    ".jsx",
                ],
            },
        ],
        "react/jsx-indent": [
            "error",
            4,
        ],
        "react/forbid-prop-types": "off",
        "import/extensions": 0,
        "no-restricted-syntax": 0,
        "no-prototype-builtins": 0,
        "no-continue": 0,
        "no-plusplus": 0,
        "consistent-return": 0,
        "prefer-destructuring": 0,
    },
    env: {
        es6: true,
        browser: true,
        node: true,
        serviceworker: true,
    },
};
