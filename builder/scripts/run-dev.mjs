import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to package.json in the root directory
const packageJsonPath = path.join(__dirname, "../../package.json");

try {
  // Read and parse package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Extract package name
  const packageName = packageJson.name;
  if (!packageName) {
    throw new Error("Package name not found in package.json");
  }

  console.log(`Package name: ${packageName}`);

  // Execute commands
  execSync("npm link", { stdio: "inherit" });
  process.chdir("./node-red");
  execSync(`npm link ${packageName}`, { stdio: "inherit" });
  process.chdir("..");
  execSync("./node_modules/.bin/node-red --settings ./node-red/settings.js --userDir ./node-red", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
