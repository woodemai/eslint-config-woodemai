import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const eslintConfig = `// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
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
