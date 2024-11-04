import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"

export default [
  {
    ignores: ["dis/*"],
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        require: "readonly",
        process: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,
    },
  },
]