import { useState, useEffect, useCallback } from 'react';
import { Chrome, ChromeListener } from '../../models/chrome.model';
import { Callback } from '../../models/general.model'


export function useLocalStorage<T = any>(key: string, initialValue?: T): [T, (value: T) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    type SetValue = (val: T) => T;
    const setValue = (value: T | SetValue) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export const useChromeStorage = <T = any>(key: string) => {
    const [item, setItem] = useState<T>(null);
    const storage = chrome.storage;

    let unmounted = false
    useEffect(() => {
        storage.sync.get(key, (obj) => {
            console.log(obj && obj[key]);

            !unmounted && item !== obj[key] && setItem(obj[key])
        })
        return () => unmounted = true;
    }, []);



    const setLocalItem = (value: T) => {
        storage.sync.set({ [key]: value });
    }

    const removeLocalItem = () => {
        storage.sync.remove(key, () => setItem(null));
    }


    return { item, setItem: setLocalItem, removeItem: removeLocalItem };
}


export const useChromeListener = <T = any, J = any>(act: Chrome.Action, callBack?: Callback<T>) => {
    const [action, setAction] = useState(act);
    const chromeListener = new ChromeListener('POPUP', action);
    const [message, setMessage] = useState(null);

    const sendMessage = <T = any>(message: T) => {
        chromeListener.sendMessage(message);
    }

    useEffect(() => chromeListener.subscribe(
        (value) => {
            setMessage(value);
            if (callBack) {
                callBack(message)
            }
        }
    ).unsubscribe, [action])

    return { message, setAction, sendMessage };

}