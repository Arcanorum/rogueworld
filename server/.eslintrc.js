module.exports = {
    extends: "airbnb-base",
    rules: {
        indent: [
            "error",
            4,
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
        "no-underscore-dangle": [
            "off",
        ],
        "import/no-unresolved": [
            "error",
        ],
        "import/no-extraneous-dependencies": [
            "off",
        ],
    },
    env: {
        es6: true,
        node: true,
    },
};
