import { it, expect, vi } from "vitest";
import * as React from "react";
import { Scroller } from "../component";
import renderer from "react-test-renderer";

it("component renders", () => {
  const tree = renderer
    .create(
      <Scroller onClickScrollTop={vi.fn()} onClickScrollBottom={vi.fn()} />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
