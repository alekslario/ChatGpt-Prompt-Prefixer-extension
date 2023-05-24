import * as React from "react";
import { Popup } from "../component";
import { Meta } from "@storybook/react";

export default {
  title: "Components/Popup",
  component: Popup,
} as Meta<typeof Popup>;

export const Render = () => <Popup />;
