import pluginVue from 'eslint-plugin-vue'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{vue,ts}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: './tsconfig.app.json',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: './tsconfig.node.json',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    /**
     * @note Sum rules does not work with vue.
     * @see https://github.com/vuejs/vue-eslint-parser/issues/104
     */
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'vue/component-tags-order': [
        'error',
        {
          order: [['script', 'template'], 'style'],
        },
      ],
    },
  },
]
