import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea, ActionIcon, TextInput } from '@mantine/core';
import styled from '@emotion/styled';
import { IconX } from '@tabler/icons-react';

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
  background-color: #fff;
  border-radius: 10px;
  height: auto;
  width: 500px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;


const StyledTabs = styled(Tabs.Tab)`
&[aria-selected="true"] {
  background-color: #242731;
  color: #fff;
}
`;

const StyledButton = styled(Button)`
   &:hover{
    background-color: #242731;
    color: #fff;
   }
`;

type State = {
    storageCache: {
        prefix?: any;
        postfix?: any;
        replace?: {
            [key: string]: string;
        }
    }
    loading?: boolean,
}

export default () => {
    const [{ storageCache, loading }, setState] = useState<State>({
        storageCache: { 'r1': { original: 'feffef', replacer: '322323223' } },
        loading: false,
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
        setState(prev => ({ ...prev, loading: true }));
        // browser.storage.sync.set({ prefix: value });
        setState(prev => ({ ...prev, loading: false }));
    };
    console.log('portal', storageCache);

    return <Portal id={'chatgpt-improved-prompt-extension-portal'}><Container>

        <div className='flex flex-row justify-end'>
            <ActionIcon aria-label='close'>
                <IconX />
            </ActionIcon></div>
        <Tabs defaultValue="prefix" className='grow'>
            <Tabs.List>
                <StyledTabs value="prefix" >Prefix</StyledTabs>
                <StyledTabs value="postfix" >Postfix</StyledTabs>
                <StyledTabs value="replace" >Replace</StyledTabs>
            </Tabs.List>

            <Tabs.Panel value="prefix" pt="xs">
                <Textarea
                    defaultValue={storageCache['prefix']}
                    label="Your prefix"
                    autosize
                    minRows={6}
                />
            </Tabs.Panel>

            <Tabs.Panel value="postfix" pt="xs">
                <Textarea
                    defaultValue={storageCache['postfix']}
                    label="Your postfix"
                    autosize
                    minRows={6}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replace" pt="xs">
                {Object.keys(storageCache).filter(key =>
                    key === 'prefix' || key === 'postfix')
                    .map((key) => {
                        const [someKey, someVal] = storageCache[key];
                        return <div className='flex flex-row justify-between'>
                            <div>{someKey}</div> <div>{someVal}</div>
                        </div>
                    })}
                <div className='flex justify-between'>
                    <TextInput
                        placeholder="my-api-key"
                        label="Original text"
                    />
                    <span className='pt-5 my-auto'>&#8594;</span>
                    <TextInput
                        placeholder="xxx-xxx-xxx"
                        label="Replace with"
                    />
                </div>
            </Tabs.Panel>
        </Tabs>
        <div className='flex flex-row justify-end mt1'>

            <StyledButton
                // @ts-ignore
                color="dark.5"
                variant="outline"
                onClick={handleSave} loading={loading}>Save</StyledButton></div>
    </Container></Portal>
};