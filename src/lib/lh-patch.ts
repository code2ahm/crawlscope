// Prevents Lighthouse report generator from reading HTML/CSS assets
// We only need audit data (lhr), not the rendered report
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Module = require("module");
const originalLoad = Module._load;

Module._load = function (request: string, ...args: unknown[]) {
  if (
    request.includes("flow-report") ||
    request.includes("standalone-flow-template") ||
    request.includes("styles.css")
  ) {
    return ""; // return empty string instead of crashing
  }
  return originalLoad.apply(this, [request, ...args]);
};
