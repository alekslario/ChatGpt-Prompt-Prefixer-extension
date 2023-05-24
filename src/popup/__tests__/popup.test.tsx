import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";
import * as React from "react";
import { Popup } from "../component";
import renderer from "react-test-renderer";

describe("test_popup", () => {
  beforeEach(() => {
    vi.mock("webextension-polyfill", () => {
      const browser = {
        tabs: {
          executeScript: vi.fn(),
          query: vi.fn(),
        },
        runtime: {
          sendMessage: vi.fn(),
        },
      };
      return { default: browser };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("component renders", () => {
    const tree = renderer.create(<Popup />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
