import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import Portal from "../components/Portal";
import "../css/app.css";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(<Portal closePortal={() => { window.close() }} />, document.getElementById("popup"));
});

