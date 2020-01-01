import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { observer, useLocalStore } from 'mobx-react';
import * as React from 'react';
import { classNames } from '../../../utils/general.util';
import Timer from '../Timer/Timer';
import Login from './../Login/Login';
import './Popup.scss';
import { useStores } from '../../store/context.store';
import { localStoreKeys } from '../../store/main.store';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        grey: {
            800: "#000000", // overrides failed
            900: "#121212" // overrides success
        },
        background: {
            paper: "#000000"
        },
        primary: {
            light: '#fff',
            main: '#09d3ac',
            dark: '#eee',
            contrastText: '#eee'
        },
        secondary: {
            main: '#40739e',
            dark: '#eee',
            light: '#fff',
            contrastText: '#eee'

        },
    },
    typography: {
        fontFamily: "Nunito Sans, Roboto, sans-serif",
        fontSize: 20,
        allVariants: {
            color: '#eee'
        }
    },
});


interface AppProps { }

const App: React.FC = (props: AppProps) => {

    const {
        store
    } = useStores();

    const localStore = useLocalStore(() => ({
        isLogin: false
    }))

    const mainClasses = classNames('popupContainer', {
        'with-login': !localStore.isLogin
    })


    const onLogin = () => {
        localStore.isLogin = !localStore.isLogin
        if (!localStore.isLogin) {
            store.time = null;
            localStorage.removeItem(localStoreKeys.useTimeKey);
        }
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className={mainClasses} >
                {
                    localStore.isLogin ? (
                        <Timer />
                    ) : (
                            <Login></Login>
                        )
                }
                <div className="buttons-container">
                    <Button onClick={onLogin}>{!localStore.isLogin ? 'Login' : 'Logout'}</Button>
                </div>
            </div>
        </MuiThemeProvider>
    )
}

export default observer(App);