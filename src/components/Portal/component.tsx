import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea, ActionIcon, TextInput } from '@mantine/core';
import styled from '@emotion/styled';
import { IconX, IconCirclePlus, IconSquareRoundedX } from '@tabler/icons-react';
import { encode, decode, deepClone } from '../../util/encode'

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
  height: 400px;
  width: 500px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;


const StyledTabs = styled(Tabs.Tab)`
&[aria-selected="true"] {
  background-color: #242731;
  color: #fff;
}
`;

const StyledButton = styled(Button) <{ needSave: boolean; }>`
&:hover {
    background-color: #242731; 
    color: #fff;
    box-shadow: 0 0 0 3px #c6cbdd;
}
${({ needSave }) => (needSave ? 'background-color: #242731; color: #fff;' : ''
    )}
`;

type State = {
    storageCache: {
        prefix?: any;
        postfix?: any;
        replace?: {
            [key: string]: {
                from: string;
                to: string;
            }
        }
    },
    localState: {
        prefix?: any;
        postfix?: any;
        replace?: {
            [key: string]: {
                from: string;
                to: string;
            }
        }
    }
    loading: boolean;
    newCount: number;
    needSave: boolean;
    requestApproval: boolean;
}

export default ({ closePortal }: { closePortal: Function; }) => {
    const [{ storageCache, loading, localState, needSave, requestApproval }, setState] = useState<State>({
        storageCache: {
            postfix: '',
            prefix: '',
            replace: {}
        },
        localState: {
            postfix: '',
            prefix: '',
            replace: {}
        },
        newCount: 0,
        loading: false,
        needSave: false,
        requestApproval: false,
    });

    useEffect(() => {
        // const storageCache = { 'replace': { 'ZmVmZmVm': { from: 'feffef', to: '222' } } };
        const storageCache = {
            postfix: '',
            prefix: '',
            replace: {}
        };
        browser.storage.sync.get().then((items) => {
            console.log('portal', items);

            // Copy the data retrieved from storage into storageCache.
            Object.assign(storageCache, items);
        });
        console.log('portal', storageCache);
        setState(prev => ({
            ...prev, storageCache, localState: deepClone(storageCache)
        }));
    }, []);

    useEffect(() => {
        if (JSON.stringify(localState) !== JSON.stringify(storageCache)) {
            setState(prev => ({ ...prev, needSave: true }));
        } else {
            setState(prev => ({ ...prev, needSave: false }));
        }
    }, [localState.postfix, localState.prefix, Object.keys(localState.replace || {}).length]);


    console.log('portal', storageCache);
    const handleInputChange = (event: any) => {
        if (loading) return;
        const { name, value, ariaLabel } = event.currentTarget;
        if (name === 'prefix' || name === 'postfix') {
            setState(prev => ({ ...prev, localState: { ...prev.localState, [name]: value } }));

        } else {
            setState(prev => ({
                ...prev, localState: {
                    ...prev.localState, replace: {
                        ...prev.localState.replace, [name]: {
                            ...prev.localState.replace?.[name], [ariaLabel]: value
                        }
                    }
                }
            }))
        }
    }

    const handleAddMore = () => {
        if (loading) return;
        setState(prev => ({
            ...prev,
            newCount: prev.newCount + 1,
            localState: {
                ...prev.localState, replace: {
                    ...prev.localState.replace, [`temp_${prev.newCount}`]: {
                        from: '',
                        to: ''
                    }
                }
            }
        }));
    };

    const handleRemove = (id: string) => {
        if (loading) return;
        delete localState.replace?.[id];
        setState(prev => ({
            ...prev,
            localState: {
                ...prev.localState, replace: {
                    ...prev.localState.replace
                }
            }
        }));
    }

    const handleSave = () => {
        setState(prev => ({ ...prev, loading: true }));
        // remove temp keys from replace
        const replace = Object.entries(localState.replace || {}).reduce((acc, [key, value]) => {
            if (value.from === '') return acc;
            if (key.startsWith('temp_')) {
                const newKey = encode(value.from);
                acc[newKey] = value;
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as { [key: string]: { from: string; to: string } });

        const newState = {
            ...localState,
            replace: replace
        }

        browser.storage.sync.set(newState);
        setState(prev => ({ ...prev, loading: false, needSave: false }));
    }

    const handleClose = () => {
        if (needSave) {
            setState(prev => ({ ...prev, requestApproval: true }));
        } else {
            closePortal();
        }

    }
    return <Portal id={'chatgpt-improved-prompt-extension-portal'}><Container>
        {requestApproval && <div className='absolute z-10 left-2/4 top-2/4'>some text</div>}
        <div className='flex flex-row justify-end mb-4'>
            <ActionIcon aria-label='close' onClick={handleClose}>
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
                    label="Your prefix"
                    autosize
                    minRows={6}
                    name='prefix'
                    value={localState['prefix']}
                    onChange={handleInputChange}
                />
            </Tabs.Panel>

            <Tabs.Panel value="postfix" pt="xs">
                <Textarea
                    label="Your postfix"
                    autosize
                    minRows={6}
                    name='postfix'
                    value={localState['postfix']}
                    onChange={handleInputChange}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replace" pt="xs" className='overflow-y-auto max-h-52' >
                {Object.keys(localState.replace || {})
                    .map((_key) => {
                        const obj = localState.replace?.[_key];

                        return <div className='flex justify-between pt-3 items-end'>
                            <TextInput
                                placeholder="my-api-key"
                                label="Original text"
                                aria-label='from'
                                value={obj?.from}
                                name={_key}
                                onChange={handleInputChange}
                            />
                            <span className='pt-5 my-auto'>&#8594;</span>
                            <TextInput
                                placeholder="xxx-xxx-xxx"
                                label="Replace with"
                                aria-label='to'
                                name={_key}
                                value={obj?.to}
                                onChange={handleInputChange}
                            />
                            <ActionIcon aria-label='remove' className='m-1' onClick={() => handleRemove(_key)}>
                                <IconSquareRoundedX />
                            </ActionIcon>
                        </div>
                    })}
                <div className='flex flex-row justify-center mt-5'>
                    <ActionIcon aria-label='Add More' onClick={handleAddMore}>
                        <IconCirclePlus />
                    </ActionIcon></div>
            </Tabs.Panel>

        </Tabs>
        <div className='flex flex-row justify-end mt-4'>

            <StyledButton
                // @ts-ignore
                color="dark.5"
                variant="outline"
                needSave={needSave}
                disabled={!needSave}
                onClick={handleSave} loading={loading}>Save</StyledButton></div>
    </Container></Portal>
};