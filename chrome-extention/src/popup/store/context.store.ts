
import * as React from 'react';
import { Store } from './main.store';
import { AuthStore } from './auth.store';

export const storesContext = React.createContext({
    store: new Store(),
    auth: new AuthStore()
})

export const useStores = () => React.useContext(storesContext)