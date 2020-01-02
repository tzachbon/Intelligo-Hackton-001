import { action, computed, observable } from 'mobx';
import { CountDate } from '../../utils/react/use-count-down';


export const localStoreKeys = {
    useTimeKey: 'useTimeKey'
}

export class Store {
    // @observable count = 0
    @observable time: CountDate;

    @action
    convertTime(date: number) {
        return new CountDate(new Date(date));
    }

    // @action.bound increment() {
    //     this.count++
    // }

    // @action.bound decrement() {
    //     this.count--
    // }

    // @computed get doubleCount() {
    //     return this.count * 2
    // }
}