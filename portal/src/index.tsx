import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider } from '@material-ui/core';
import materialTheme from './utils/theme/material.theme';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase';


const firebaseConfig = {
    apiKey: 'AIzaSyAAWrAS-iJ1UKhD4qTCj6C0so3SsuG9ccs',
    authDomain: 'time-machine-inc.firebaseapp.com',
    databaseURL: 'https://time-machine-inc.firebaseio.com',
    projectId: 'time-machine-inc',
    storageBucket: 'time-machine-inc.appspot.com',
    messagingSenderId: '1089237555739',
    appId: '1:1089237555739:web:c1e1a3d07e848ccf8bb6be',
    measurementId: 'G-L8Y8WY3MD7'
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
    <BrowserRouter>
        <MuiThemeProvider theme={materialTheme}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
