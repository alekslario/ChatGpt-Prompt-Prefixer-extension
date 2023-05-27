import React, { useState, useEffect } from 'react';
import browser from "webextension-polyfill";
import { Tabs, Button, Textarea, ActionIcon, TextInput, Checkbox, HoverCard, Text } from '@mantine/core';
import styled from '@emotion/styled';
import { IconX, IconCirclePlus, IconSquareRoundedX, IconRegex } from '@tabler/icons-react';
import { encode, decode, deepClone } from '../../util/encode'

const Portal = styled.div`
    top: 0;
    left: 0;
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
  /* border-radius: 10px; */
  height: 400px;
  width: 500px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .mantine-TextInput-error{
    position: absolute;
  }
  .mantine-Input-wrapper{
    margin-bottom: 0 !important;
  }
  .mantine-InputWrapper-root{
    position: relative;
  }
  & input {
    border-radius: 5px;

  }
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

const StyledCheckbox = styled(Checkbox)`

& input:checked {
    background-color: #242731;
    border-color: #242731;
    box-shadow: 0 0 0 3px #c6cbdd;
    background-image:none;
}
`;

type State = {
    storageCache: {
        prefix?: any;
        postfix?: any;
        replace?: {
            [key: string]: {
                from: string;
                to: string;
                regex: boolean;
                regexBody: string;
                regexFlags: string;
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
                regex: boolean;
                regexBody: string;
                regexFlags: string;
            }
        }
    }
    loading: boolean;
    newCount: number;
    needSave: boolean;
    requestApproval: boolean;
}

const testRegularExp = (str: string) => {
    const rgxArray = str.split('');
    if (rgxArray.shift() !== '/') return [];
    const flags = {} as { [key: string]: number };
    let valid = false;
    while (true) {
        let lastChar = rgxArray.pop();
        if (lastChar === '/' && rgxArray.join('').length > 0) {
            valid = true;
            break;
        } else if (!lastChar || flags[lastChar]) {
            //not valid
            break;

        } else if ('gimsuy'.includes(lastChar)) {
            flags[lastChar] = 1;
            continue;
        } else {
            //not valid
            break;
        }

    }
    if (!valid) return [];
    try {
        const flagsString = Object.keys(flags).join('');
        const bodyString = rgxArray.join('');
        new RegExp(bodyString, flagsString);
        return [bodyString, flagsString];
    } catch (error) {
        return [];
    }
}

const PopUp = styled.div`
    box-shadow: 0 1px 6px rgba(32,33,36,0.28);
    border: 1px solid rgba(223,225,229,0);
    position: absolute; 
    top: 50%;
    left: 50%;
    z-index: 10; 
    padding: 1.25rem; 
    background-color: #ffffff; 
    transform: translate(-50%, -50%);
    border-radius: 0.375rem; 
    margin: auto;
`

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
        requestApproval: false
    });

    useEffect(() => {
        const storageCache = {
            postfix: '',
            prefix: '',
            replace: {}
        };
        browser.storage.sync.get().then((items) => {

            // Copy the data retrieved from storage into storageCache.
            Object.assign(storageCache, items);
            const localState = deepClone(storageCache);
            setState(prev => ({
                ...prev, storageCache, localState
            }));
        });
    }, []);

    useEffect(() => {
        if (JSON.stringify(localState) !== JSON.stringify(storageCache)) {
            setState(prev => ({ ...prev, needSave: true }));
        } else {
            setState(prev => ({ ...prev, needSave: false }));
        }
    }, [btoa(JSON.stringify(localState))]);

    const handleInputChange = (event: any) => {
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
        if (requestApproval || loading) return;
        setState(prev => ({
            ...prev,
            newCount: prev.newCount + 1,
            localState: {
                ...prev.localState, replace: {
                    ...prev.localState.replace, [`temp_${prev.newCount}`]: {
                        from: '',
                        to: '',
                        regex: false,
                        regexBody: '',
                        regexFlags: ''
                    }
                }
            }
        }));
    };

    const handleRemove = (id: string) => {
        if (requestApproval || loading) return;
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

    const handleSave = async () => {
        if (loading) return;

        setState(prev => ({ ...prev, loading: true }));
        // remove temp keys from replace
        const replace = Object.entries(localState.replace || {}).reduce((acc, [key, value]) => {
            if (value.from === '') return acc;

            if (value.regex) {
                const passed = testRegularExp(value.from);
                if (passed.length === 2) {
                    value.regexBody = passed[0];
                    value.regexFlags = passed[1];
                } else {
                    return acc;
                }
            }
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
        await browser.storage.sync.set(newState);
        closePortal();
    }

    const handleClose = () => {
        if (requestApproval || loading) return;
        if (needSave) {
            setState(prev => ({ ...prev, requestApproval: true }));
        } else {
            closePortal();
        }

    }

    const handleChecked = (key: string, checked: boolean) => {
        setState(prev => ({
            ...prev,
            localState: {
                ...prev.localState, replace:
                {
                    ...prev.localState.replace, [key]:
                        { ...prev.localState.replace?.[key] as any, regex: checked }
                }
            }
        }));
    }

    return <Container>
        {requestApproval && <PopUp >
            <Button
                color="dark.5"
                variant="outline"
                style={{ marginRight: '15px' }}
                onClick={() => closePortal()}>
                Discard
            </Button>
            <Button color="dark.5"
                variant="outline"
                onClick={() => setState(prev => ({ ...prev, requestApproval: false }))}>Cancel</Button>
        </PopUp>}
        <div className='flex flex-row justify-end mb-4'>
            <ActionIcon aria-label='close' onClick={handleClose} disabled={requestApproval || loading}>
                <IconX />
            </ActionIcon></div>
        <Tabs defaultValue="prefix" className='grow' >
            <Tabs.List>
                <StyledTabs value="prefix" >Prefix</StyledTabs>
                <StyledTabs value="postfix" >Postfix</StyledTabs>
                <StyledTabs value="replace" >Replace</StyledTabs>
            </Tabs.List>

            <Tabs.Panel value="prefix" pt="xs">
                <Textarea
                    label="Your prefix"
                    minRows={6}
                    maxRows={6}
                    name='prefix'
                    value={localState['prefix']}
                    onChange={handleInputChange}
                    disabled={requestApproval || loading}
                />
            </Tabs.Panel>

            <Tabs.Panel value="postfix" pt="xs">
                <Textarea
                    label="Your postfix"
                    minRows={6}
                    maxRows={6}
                    name='postfix'
                    value={localState['postfix']}
                    onChange={handleInputChange}
                    disabled={requestApproval || loading}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replace" pt="xs" className='overflow-y-auto w-full pr-[10px]' style={{ 'scrollbarGutter': 'stable', maxHeight: '200px' }} >
                {Object.keys(localState.replace || {}).length === 0 && <p className='m-5'> Strings and regular expressions are accepted. Invalid regular expressions and empty strings are discarded on save.</p>}

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
                                disabled={requestApproval || loading}
                                error={obj?.regex ?
                                    testRegularExp(obj?.from as string).length === 2 ? "" : 'Invalid regex'
                                    : ''}
                            />
                            <span style={{ padding: '7px' }}>→</span>
                            <TextInput
                                placeholder="xxx-xxx-xxx"
                                label="Replace with"
                                aria-label='to'

                                name={_key}
                                value={obj?.to}
                                onChange={handleInputChange}
                                disabled={requestApproval || loading}
                            />
                            <span className='flex items-center pl-2.5'>
                                <HoverCard width={280} shadow="md">
                                    <HoverCard.Target>
                                        <StyledCheckbox icon={IconRegex} aria-label="Regex" indeterminate
                                            checked={obj?.regex} onChange={(event) => {
                                                const value = event.currentTarget.checked;
                                                handleChecked(_key, value);
                                            }}
                                        />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text size="sm">
                                            Check this checkbox to treat the original text on the left as a regular expression.
                                        </Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>

                                <ActionIcon disabled={requestApproval || loading} aria-label='remove' className='m-1' onClick={() => handleRemove(_key)} color="dark">
                                    <IconSquareRoundedX />
                                </ActionIcon>
                            </span>
                        </div>
                    })}
                <div className='flex flex-row justify-center mt-5'>
                    <ActionIcon aria-label='Add More' color="dark" onClick={handleAddMore} disabled={requestApproval || loading}>
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
    </Container>
};