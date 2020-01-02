import * as firebase from 'firebase';
import { observable, computed, action } from 'mobx';

export interface IDate {
    start: number, end: number | null, isFinished: boolean
}
export class AuthStore {
    @observable user: firebase.User;
    @observable dates: Array<IDate> = [];


    @computed
    get token() {
        return this.user.getIdToken();
    }

    @action
    getUserTime() {
        return firebase
            .firestore()
            .collection(`user-time`)
            .doc(this.user.uid)
            .get()
            .then(res => {
                const { dates } = res.data()
                this.dates = dates;
                return this.dates[this.dates.length - 1];
            })
    }

    @action
    setUserTime() {
        try {
            return firebase.firestore()
                .collection(`user-time`)
                .doc(this.user.uid)
                .set({
                    dates: this.dates
                })

        } catch (e) {
            return new Promise((res, rej) => {
                rej(e)
            })
        }
    }

    @action
    updateUserTime(date?: number) {
        this.dates = this.dates || [];
        if (this.dates ?.length) {
            const lastDate = this.dates[this.dates.length - 1];
            if (lastDate ?.isFinished) {
                this.dates.push({
                    start: date,
                    end: null,
                    isFinished: false
                })
            } else {
                this.dates[this.dates.length - 1] = {
                    start: date,
                    end: null,
                    isFinished: false
                };
            }


        } else {
            this.dates.push({
                start: date,
                end: null,
                isFinished: false
            })
        }



        try {
            return firebase.firestore()
                .collection(`user-time`)
                .doc(this.user.uid)
                .update({
                    dates: this.dates
                })

        } catch (e) {
            return new Promise((res, rej) => {
                rej(e)
            })
        }
    }

    @action
    setFinished() {
        const date = this.dates[this.dates.length - 1];
        this.dates[this.dates.length - 1] = {
            start: date.start,
            end: Date.now(),
            isFinished: true
        }
        return firebase.firestore()
            .collection(`user-time`)
            .doc(this.user.uid)
            .set({
                dates: this.dates
            })
    }
}