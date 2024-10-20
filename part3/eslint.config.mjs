import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        require: "readonly", // Agrega require como global
        process: "readonly", // Agrega process como global
      },
    },
    settings: {
      react: {
        version: "detect", // Detecta la versión de React
      },
    },
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
]
