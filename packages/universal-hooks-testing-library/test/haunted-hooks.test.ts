import * as haunted from "haunted";
import * as hauntedTestingLib from "@saasquatch/haunted-hooks-testing-library";
import { runTests } from "./universal-test-suite";

describe("Haunted", () => {
  runTests(haunted, hauntedTestingLib);
});
