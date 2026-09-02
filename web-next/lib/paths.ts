import path from "node:path";

/**
 * Runtime data must not depend on the standalone server's current directory.
 * In development the project root is used; production sets an explicit root.
 */
const configuredRoot = process.env.NEUMOSHKA_STORAGE_ROOT;
const npmProjectRoot = process.env.INIT_CWD;
const defaultRoot =
  npmProjectRoot && path.isAbsolute(npmProjectRoot)
    ? npmProjectRoot
    : process.cwd();

export const PRIVATE_LIBRARY_DIR = configuredRoot
  ? path.join(path.resolve(configuredRoot), "private", "library")
  : path.join(defaultRoot, "private", "library");

export const STORE_DIR = configuredRoot
  ? path.join(path.resolve(configuredRoot), "data", "store")
  : path.join(defaultRoot, "data", "store");
