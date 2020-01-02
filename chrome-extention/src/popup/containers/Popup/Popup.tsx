import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { observer, useLocalStore } from 'mobx-react';
import * as React from 'react';
import { classNames } from '../../../utils/general.util';
import Timer from '../Timer/Timer';
import Login from './../Login/Login';
import './Popup.scss';
import { useStores } from '../../store/context.store';
import { localStoreKeys } from '../../store/main.store';
import * as firebase from 'firebase';



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
        store,
        auth
    } = useStores();

    const localStore = useLocalStore(() => ({
        isLogin: false
    }))

    const mainClasses = classNames('popupContainer', {
        'with-login': !localStore.isLogin
    })

    React.useEffect(() => {

        if (auth.user) {
            auth.getUserTime()
                .then((time) => {
                    debugger;
                    if (time.isFinished) {
                        store.time = null;
                    } else {
                        console.log(time.start);

                        store.time = store.convertTime(time ?.start);
                    }
                    localStore.isLogin = !!auth.user;
                })
                .catch(err => {
                    store.time = null;
                    localStore.isLogin = !!auth.user;
                    console.log(err);

                })
        } else {
            localStore.isLogin = !!auth.user;
        }


    }, [auth.user])

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
            </div>
        </MuiThemeProvider>
    )
}

export default observer(App);