import './Timer.scss';
import * as React from 'react';
import { Typography } from '@material-ui/core';
import { CountDate } from '../../../utils/react/use-count-down';

export interface ITimerProps {
    time: CountDate
}

export function Timer(props: ITimerProps) {
    const {
        time
    } = props;

    return (
        <Typography variant="h6" className='flex-center t-center' gutterBottom>
            {time.toString()}
        </Typography>
    );
}
