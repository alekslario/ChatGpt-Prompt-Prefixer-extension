import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea } from '@mantine/core';
import styled from '@emotion/styled';
type State = {
    storageCache: {
        prefix?: string,
        postfix?: string,
        [key: string]: string | undefined,
    }
}

const Portal = styled.div`
height: 100vh;
width: 100vw;
position: fixed;
background-color: rgba(0,0,0,0.1);
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
z-index: 10000000;
`

const Container = styled.div`
  min-width: 300px;
  min-height: 400px;
  background-color: red;
  height: 600px;
  width: 500px;
  padding: 20px;
`;
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
        setState(prev => ({ ...prev, storageCache }));
    }, []);
    const handleAdd = (key: string) => {

    };
    const handleSave = () => {
        // browser.storage.sync.set({ prefix: value });

    };
    console.log('portal', storageCache);

    return <Portal id={'chatgpt-improved-prompt-extension-portal'}><Container>
        <Button onClick={handleSave}></Button>
        <Tabs defaultValue="prefix">
            <Tabs.List>
                <Tabs.Tab value="Prefix" >prefix</Tabs.Tab>
                <Tabs.Tab value="Postfix" >postfix</Tabs.Tab>
                <Tabs.Tab value="Replace" >Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Prefix" pt="xs">
                <Textarea
                    defaultValue={storageCache['prefix']}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />
            </Tabs.Panel>

            <Tabs.Panel value="Postfix" pt="xs">
                <Textarea
                    defaultValue={storageCache['prefix']}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />
            </Tabs.Panel>

            <Tabs.Panel value="Replace" pt="xs">
                Settings tab content
            </Tabs.Panel>
        </Tabs>
    </Container></Portal>
};