import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const sourceUrl = new URL("../lib/material-access.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const { outputText, diagnostics = [] } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourceUrl.pathname,
  reportDiagnostics: true,
});

assert.equal(
  diagnostics.length,
  0,
  diagnostics.map((diagnostic) => diagnostic.messageText).join("\n")
);

const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { resolveMaterialAccess } = await import(moduleUrl);

test("allows free lessons without authentication or an unlock", () => {
  assert.equal(
    resolveMaterialAccess({
      free: true,
      authenticated: false,
      unlocked: false,
    }),
    "allowed"
  );
});

test("requires login for protected lessons", () => {
  assert.equal(
    resolveMaterialAccess({
      free: false,
      authenticated: false,
      unlocked: false,
    }),
    "login"
  );
  assert.equal(
    resolveMaterialAccess({
      free: false,
      authenticated: false,
      unlocked: true,
    }),
    "login",
    "an unlock cannot be trusted without an authenticated user"
  );
});

test("requires a share unlock for authenticated protected lessons", () => {
  assert.equal(
    resolveMaterialAccess({
      free: false,
      authenticated: true,
      unlocked: false,
    }),
    "share"
  );
});

test("allows an authenticated user with an unlock", () => {
  assert.equal(
    resolveMaterialAccess({
      free: false,
      authenticated: true,
      unlocked: true,
    }),
    "allowed"
  );
});
