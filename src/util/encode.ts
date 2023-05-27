import browser from "webextension-polyfill";

export const encode = (key: string) => {
    return btoa(encodeURIComponent(key));
}

export const decode = (key: string) => {
    return decodeURIComponent(atob(key));
}

export const deepClone = (obj: any) => {


    return JSON.parse(JSON.stringify(obj));
}