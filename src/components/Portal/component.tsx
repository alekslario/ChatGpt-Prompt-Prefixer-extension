import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea } from '@mantine/core';
type State = {
    storageCache: {
        prefix?: string,
        postfix?: string,
        [key: string]: string | undefined,
    }
}
export default () => {
    const [{ storageCache }, setState] = useState<State>({
        storageCache: {},
    });

    useEffect(() => {
        const storageCache = {};
        browser.storage.sync.get().then((items) => {
            console.log('portal', items);

            // Copy the data retrieved from storage into storageCache.
            Object.assign(storageCache, items);
        });
        console.log('portal', storageCache);
        browser.storage.sync.get(['prefix']);
        setState(prev => ({ ...prev, storageCache }));
    }, []);
    const handleAdd = (key: string) => {

    };
    const handleSave = () => {
        // browser.storage.sync.set({ prefix: value });

    };
    console.log('portal', storageCache);

    return <div id={'chatgpt-improved-prompt-extension-portal'}><div>portal
        <Button onClick={handleSave}></Button>
        <Tabs defaultValue="prefix">
            <Tabs.List>
                <Tabs.Tab value="prefix" >prefix</Tabs.Tab>
                <Tabs.Tab value="postfix" >postfix</Tabs.Tab>
                <Tabs.Tab value="settings" >Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="prefix" pt="xs">
                <Textarea
                    defaultValue={storageCache['prefix']}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />
            </Tabs.Panel>

            <Tabs.Panel value="postfix" pt="xs">
                <Textarea
                    defaultValue={storageCache['prefix']}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />
            </Tabs.Panel>

            <Tabs.Panel value="replace" pt="xs">
                Settings tab content
            </Tabs.Panel>
        </Tabs>
    </div></div>
};