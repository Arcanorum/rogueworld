const a11yOff = Object.keys(require("eslint-plugin-jsx-a11y").rules)
    .reduce((acc, rule) => { acc[`jsx-a11y/${rule}`] = "off"; return acc; }, {});

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
            1,
        ],
        "no-param-reassign": [
            0,
        ],
        "class-methods-use-this": [
            0,
        ],
        "max-classes-per-file": [
            0,
        ],
        quotes: [
            "error",
            "double",
        ],
        "linebreak-style": [
            0,
        ],
        "import/no-unresolved": [
            2,
        ],
        "import/no-extraneous-dependencies": [
            0,
        ],
        "react/jsx-filename-extension": [
            1,
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
    },
    env: {
        es6: true,
        browser: true,
        node: true,
        serviceworker: true,
    },
};
