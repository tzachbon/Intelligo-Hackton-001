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
import { Button } from '@material-ui/core';

export interface ITimerProps {
}

function Timer(props: ITimerProps) {
    const {
        auth,
        store
    } = useStores();

    const [timer, setTimer] = useCountDown(store ?.time ?.date ?? null);

    function setItem(date: number) {
        auth.updateUserTime(date)
            .then(res => {
                setTimer(new Date(date))
            })
            .catch(err => {
                console.log(err);

            })
    }

    React.useEffect(() => {
        if (timer && timer.date) {
            store.time = timer;
        } else {
            store.time = null
        }
    }, [timer])

    React.useEffect(() => {
        if (store.time !== timer) {
            setItem(store ?.time ?.date ?.getTime())
        } else {
            store.time = timer;
        }
    }, [store.time])

    const updateTime = () => {
        const date = Date.now();
        setItem(date)
    }

    const onFinish = () => {
        auth.setFinished()
            .then(res => {
                setTimer(null)
            })
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
        <>
            <div className='timer-container flex-center t-center'>
                {timerRef || <FingerPrint updateTime={updateTime} />}
            </div>
            {
                !!timerRef && (
                    <div className="button-container">
                        <Button onClick={onFinish}>Finish</Button>
                    </div>
                )
            }
        </>
    );
}

export default observer(Timer);