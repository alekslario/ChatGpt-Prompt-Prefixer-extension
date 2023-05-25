import React from 'react';
import { createRoot } from 'react-dom/client';
import FilterButton from '../components/FilterButton';
import browser from "webextension-polyfill";
let form = null
const mount = () => {
  setTimeout(() => {
    form = document.querySelector('form')
    const span = document.createElement('span')
    span.id = 'chatgpt-improved-prompt-extension'
    if (form) {
      form.appendChild(span)
      const submitButton: any = document.querySelector('form button');

      if (submitButton)
        submitButton.onclick = () => { console.log('clicked submit button'); }
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
