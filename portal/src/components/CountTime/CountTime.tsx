import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../store/contexts.store';
import { CountDate } from '../../utils/use-count-down';
import { toPairs } from 'lodash';
import './CountTime.scss';
import { Button } from '@material-ui/core';
import { useEffect } from 'react';

interface ICountTimeProps {
}

const CountTime: React.FunctionComponent<ICountTimeProps> = (props) => {
    const {
        store
    } = useStores()

    const timeString = (time: number) => time.toString().length < 2 ? `0${time}` : time;


    const onFinish = () => {
        const lastDate = store.dates[store.dates.length - 1];
        lastDate.isFinished = true;
        lastDate.end = Date.now();
        store.dates[store.dates.length - 1] = lastDate;
        store.time = null
        // store.canCreateCount = true;
    }

    useEffect(() => {
        store.canCreateCount = false;
    }, [])


    return (
        <div className="counter-container">
            <div className="counter">
                {
                    !!store.time && toPairs((store.time as CountDate).asObject(false))
                        .map(([name, time], i) => (
                            <div key={`${name}_${i}`} className="time-unit">
                                {!!i && ':'}  {timeString(time)}
                            </div>
                        ))
                }
            </div>
            <Button onClick={onFinish}>Finish</Button>
        </div>
    );
};

export default observer(CountTime);
