import React from 'react';
import { createRoot } from 'react-dom/client';
import FilterButton from '../components/FilterButton';
import browser from "webextension-polyfill";
let form = null


// function simulateClick() {
//   const event = new MouseEvent("click", {
//     view: window,
//     bubbles: true,
//     cancelable: true,
//   });
//   const cb = document.getElementById("checkbox");
//   const cancelled = !cb.dispatchEvent(event);

//   if (cancelled) {
//     // A handler called preventDefault.
//     alert("cancelled");
//   } else {
//     // None of the handlers called preventDefault.
//     alert("not cancelled");
//   }
// }
const mount = () => {
  setTimeout(() => {
    form = document.querySelector('form')
    const span = document.createElement('span')
    span.id = 'chatgpt-improved-prompt-extension'
    if (form) {
      form.appendChild(span)
    }

    const container = document.getElementById('chatgpt-improved-prompt-extension');
    if (!container) throw new Error('No container');
    const root = createRoot(container);

    root.render(<FilterButton />)
  }, 500)

}
mount()
browser.runtime.onMessage.addListener((message) => {
  if (message.name === 'urlChange') {
    mount()
  }
});
