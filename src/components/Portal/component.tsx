import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea } from '@mantine/core';
type State = {
    tab: string;
    storageCache: {
        prefix?: string,
        postfix?: string,
        [key: string]: string | undefined,
    }
}
export default () => {
    const [{ storageCache, tab }, setState] = useState<State>({
        tab: 'prefix',
        storageCache: {},
    });

    const [value, setValue] = useState('');
    useEffect(() => {
        const storageCache = {};
        browser.storage.sync.get().then((items) => {
            console.log('portal', items);

            // Copy the data retrieved from storage into storageCache.
            Object.assign(storageCache, items);
        });
        console.log('portal', storageCache);
        chrome.storage.sync.get(['prefix'], function (result) {
            console.log('Value currently is ' + result.prefix);
        });
        setState(prev => ({ ...prev, storageCache }));
    }, []);
    const handleAdd = (key: string) => {

    };
    const handleSave = () => {
        chrome.storage.sync.set({ prefix: value }, () => {
            console.log('Value is set to ' + value)
            chrome.storage.sync.get(['prefix'], function (result) {
                console.log('Value currently is ' + result.prefix);
            });
        });

    };
    console.log('portal', storageCache);

    return <div id={'chatgpt-improved-prompt-extension-portal'}><div>portal
        <Button onClick={handleSave}></Button>
        <Tabs defaultValue="prefix">
            <Tabs.List>
                <Tabs.Tab value="prefix" >prefix</Tabs.Tab>
                <Tabs.Tab value="messages" >Messages</Tabs.Tab>
                <Tabs.Tab value="settings" >Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="prefix" pt="xs">
                {storageCache['prefix'] ? storageCache['prefix'] : <Textarea
                    value={value} onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />}
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
                Messages tab content
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
                Settings tab content
            </Tabs.Panel>
        </Tabs>
    </div></div>
};