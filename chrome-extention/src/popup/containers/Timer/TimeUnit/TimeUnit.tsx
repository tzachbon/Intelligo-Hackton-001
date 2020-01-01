import { observer } from 'mobx-react';
import * as React from 'react';
import './TimeUnit.scss';


export interface ITimeUnitProps {
    time: number,
    index: number
}

const TimeUnit: React.FC<ITimeUnitProps> = props => {
    const {
        time,
        index,
    } = props;

    const timeString = time.toString().length < 2 ? `0${time}` : time;

    return (
        <span className='time-unit'>
            {!!index && ':'} {timeString}
        </span>
    );
}

export default observer(TimeUnit);