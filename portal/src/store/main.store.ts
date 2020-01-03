import { action, computed, observable } from 'mobx';
import * as firebase from 'firebase';


type User = firebase.User;
export class Store {
    @observable showSideBar = false;
    @observable user: User | null | undefined;
    @observable dates: any = []
    @observable date: any;
    @observable time: any;
    @observable loading = true;
    @observable init = true;
    @observable canCreateCount = true;

    @action
    toggleSideBar(state?: boolean) {
        if (typeof state === 'boolean') {
            this.showSideBar = state;
        } else {
            this.showSideBar = !this.showSideBar;
        }
    }
}

