import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const eslintConfig = `// eslint.config.mjs
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsConfigRootDir: './',
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': 'error',
      'no-trailing-spaces': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      'one-var': 'off',
      'max-statements': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'no-shadow': 'off',
      'no-implicit-coercion': 'off',
      'init-declarations': 'off',
      'no-undefined': 'off',
      'max-params': 'off',
      camelcase: 'off',
      'id-length': ['error', { exceptions: ['_', 'e', 'x', 'y'] }],
      'capitalized-comments': 'off',
      'no-warning-comments': 'warn',

      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
            orderImportKind: 'asc',
          },
          'newlines-between': 'always',
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
];
`;

const filePath = path.join(process.cwd(), "eslint.config.mjs");

function getCommand(packageManager) {
  switch (packageManager) {
    case "yarn":
      return "npm add";
    case "pnpm":
      return "pnpm add";
    default:
      return "npm add";
  }
}

function installDependencies() {
  const dependencies = [
    "@eslint/js",
    "eslint",
    "globals",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    'eslint-plugin-import',
    "typescript-eslint",
  ];

  const packageManager = detectPackageManager();
  console.log(`Package manager: ${packageManager}`)
  const command = getCommand(packageManager);

  try {
    console.log("Installing dependencies...");
    execSync(`${command} ${dependencies.join(" ")} --save-dev`, {
      stdio: "inherit",
    });
    console.log("Dependencies have been installed.");
  } catch (error) {
    console.error("Error installing dependencies:", error);
    process.exit(1);
  }
}

function detectPackageManager() {
  console.log("Detecting package manager...");
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) {
    return "yarn";
  } else if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) {
    return "pnpm";
  } else {
    return "npm";
  }
}

installDependencies();

fs.writeFile(filePath, eslintConfig, (err) => {
  if (err) {
    console.error("Error creating file:", err);
    process.exit(1);
  }
  console.log("eslint.config.mjs created!");
});
