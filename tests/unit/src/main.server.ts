import { ServerScriptService } from "@rbxts/services";
import TestEZ from "@rbxts/testez";

// Using transformer for transformer while testing
// is not reliable (may cause errors). So I made a workaround.
declare global {
  export interface ServerScriptService {
    tests: Folder;
  }
}

const results = TestEZ.TestBootstrap.run([ServerScriptService.tests]);
if (results.errors.size() > 0 || results.failureCount > 0) {
  error("Tests failed!");
}
