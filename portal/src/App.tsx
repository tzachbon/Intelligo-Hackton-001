import { observer, useLocalStore } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import Map from './components/Map/Map';
import TopBar from './components/top-bar/top-bar';
import { useStores } from './store/contexts.store';
import SideBar from './components/SideBar/SideBar';
import MyWork from './components/MyWork/MyWork';
import * as firebase from 'firebase';
import { CircularProgress } from '@material-ui/core';


const App: React.FC = () => {
  const { store } = useStores();

  useEffect(() => {
    firebase
      .auth()
      .signInWithEmailAndPassword('test@test.com', 'test1234')
      .then(res => {
        store.user = res.user;
        store.loading = false;
      })
  }, [])


  return (
    <div className="App">
      <TopBar></TopBar>
      <SideBar></SideBar>
      {
        store.loading ? (
          <div className="spinner-container">
            <CircularProgress />
          </div>
        ) : (
            <Switch>
              <Route path='/my-work' exact>
                <MyWork></MyWork>
              </Route >
              <Route path='/'>
                <Map zoom={17} />
              </Route>
            </Switch >
          )
      }
    </div >
  );
}

export default observer(App);
