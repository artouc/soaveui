module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2022: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "prettier"
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint"],
    rules: {
        // CLAUDE.md規則: セミコロンなし
        "semi": ["error", "never"],
        "@typescript-eslint/semi": ["error", "never"],

        // CLAUDE.md規則: ダブルクォーテーション優先
        "quotes": ["error", "double"],
        "@typescript-eslint/quotes": ["error", "double"],

        // CLAUDE.md規則: インデントはスペース4つ
        "indent": ["error", 4],
        "vue/html-indent": ["error", 4],
        "vue/script-indent": ["error", 4, { baseIndent: 0 }],

        // Vue固有
        "vue/multi-word-component-names": "off",
        "vue/no-v-html": "off",

        // TypeScript
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "warn"
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                "indent": "off"
            }
        }
    ]
}
