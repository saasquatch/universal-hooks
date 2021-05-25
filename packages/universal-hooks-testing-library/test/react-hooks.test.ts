import { runTests } from "./universal-test-suite";
import * as React from "react";
import * as ReactTestLib from "@testing-library/react-hooks";

describe("React", () => {
  runTests(React, ReactTestLib);
});
