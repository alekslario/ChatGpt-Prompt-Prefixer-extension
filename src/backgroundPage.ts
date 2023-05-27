import browser from "webextension-polyfill";
import { Popup } from "./popup/component";
// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  if (request.popupMounted) {
    console.log("backgroundPage notified that Popup.tsx has mounted.");
  }
});


// function myFunction() {
//   console.log("about to append butttttonss!!!!!!!!!!!!!!!!");

//   var el = document.querySelector("form");
//   var button = document.createElement("button");
//   var text = document.createTextNode("test");
//   button.appendChild(text);
//   el?.appendChild(button);
//   'appending a button'
// }
// function greetUser(name: any) {
//   var el = document.querySelector("textarea");
//   var button = document.createElement("button");
//   var text = document.createTextNode("test");
//   button.appendChild(text);
//   el?.appendChild(button);
// }
// Get the tab that matches the URL
// browser.tabs.query({ url: "https://chat.openai.com/*" }).then(async (tabs) => {
//   console.log("tabs", tabs);

//   // Inject the function into the tab
//   // await browser.tabs.executeScript({
//   //   code: `console.log('location:', window.location.href);`
//   // }
//   // );
//   if (tabs[0].id) {
//     browser.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       func: greetUser,
//       args: ['ddddddd'],
//     });
//   }


// });




try {
  browser.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    browser.tabs.sendMessage(details.tabId, { name: "urlChange" })
  },
    { url: [{ urlMatches: 'https://chat.openai.com/*' }] });
} catch (error) {

}
