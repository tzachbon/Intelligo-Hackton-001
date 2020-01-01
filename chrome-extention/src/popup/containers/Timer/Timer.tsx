import { toPairs } from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useLocalStorage } from '../../../utils/react/use-chrome';
import useCountDown from '../../../utils/react/use-count-down';
import './Timer.scss';
import TimeUnit from './TimeUnit/TimeUnit';
import FingerPrint from '../FingerPrint/FingerPrint';

export interface ITimerProps {
}

function Timer(props: ITimerProps) {
    const [item, setItem] = useLocalStorage<number>('useTimeKey')
    const [timer, setTimer] = useCountDown(new Date(item));


    React.useEffect(() => {
        console.log(timer);

        setTimer(new Date(item));
    }, [item]);

    const updateTime = () => {
        const date = Date.now();
        setItem(date)
    }



    let timerRef = null
    if (timer && timer.isValid) {
        timerRef = (
            <div className="timer-container">
                {
                    toPairs(timer.asObject(false))
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