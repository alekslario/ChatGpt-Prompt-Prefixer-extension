import React from 'react';
import FilterSvg from './FilterSvg';
import browser from "webextension-polyfill";
// import './index.css'

const getStorage = async () => {
    return new Promise((resolve, reject) => {
        browser.storage.sync.get().then((items) => {
            resolve(items);
        });

    });
}
export default () => {
    const handleClick = async (e: any) => {
        e.preventDefault();
        const node: any = document.querySelector('form textarea');
        if (node) {
            let nodeValue = node.value;
            const storage: any = await getStorage();
            Object.entries(storage.replace).forEach(([key, value]) => {
                const { to, from, regex, regexFlags, regexBody } = value as any;
                let newRegex = null;
                if (regex) {
                    newRegex = new RegExp(regexBody, regexFlags);
                    nodeValue = nodeValue.replace(newRegex, to);
                } else {
                    nodeValue = nodeValue.replace(from, to);
                }

            });
            node.value = storage.prefix + nodeValue + storage.postfix;
        }
    }
    return <button onClick={handleClick}><FilterSvg /></button>

}