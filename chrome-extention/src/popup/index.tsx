import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './containers/Popup/Popup';
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

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<Popup />, document.getElementById('popup'));
});

