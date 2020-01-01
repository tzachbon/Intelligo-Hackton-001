import { toPairs } from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useLocalStorage } from '../../../utils/react/use-chrome';
import useCountDown from '../../../utils/react/use-count-down';
import { useStores } from '../../store/context.store';
import { localStoreKeys } from '../../store/main.store';
import FingerPrint from '../FingerPrint/FingerPrint';
import './Timer.scss';
import TimeUnit from './TimeUnit/TimeUnit';

export interface ITimerProps {
}

function Timer(props: ITimerProps) {
    const {
        store
    } = useStores();

    const [item, setItem] = useLocalStorage<number>(localStoreKeys.useTimeKey)
    const [timer, setTimer] = useCountDown(new Date(item));


    React.useEffect(() => {
        setTimer(new Date(item));
    }, [item]);

    React.useEffect(() => {
        store.time = timer;
    }, [timer])

    React.useEffect(() => {
        if (store.time !== timer) {
            setItem(store.time.date.getTime())
        } else {
            store.time = timer;
        }
    }, [store.time])

    const updateTime = () => {
        const date = Date.now();
        setItem(date)
    }



    let timerRef = null
    if (store.time && store.time.isValid) {
        timerRef = (
            <div className="timer-container">
                {
                    toPairs(store.time.asObject(false))
                        .map(([name, time], i) => (
                            <TimeUnit key={`${name}_${i}`} index={i} time={time} />
                        ))
                }
            </div>
        )
    }

    return (
        <div className='timer-container flex-center t-center'>
            {timerRef || <FingerPrint updateTime={updateTime} />}
        </div>
    );
}

export default observer(Timer);