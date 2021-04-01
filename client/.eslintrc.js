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
                code: 100,
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
        "react/destructuring-assignment": "off",
    },
    env: {
        es6: true,
        browser: true,
        node: true,
        serviceworker: true,
    },
};
