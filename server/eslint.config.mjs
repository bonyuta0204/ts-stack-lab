import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
      },
    },
  },
  {
    files: ["**/*.{js,mjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
];
