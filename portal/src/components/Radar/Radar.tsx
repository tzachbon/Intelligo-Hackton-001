import * as React from 'react';
import { observer } from 'mobx-react-lite';
import './Radar.scss';

interface IRadarProps {
}

const Radar: React.FunctionComponent<IRadarProps> = (props) => {
    return (
        <div className="point">
            <div className="pointer"></div>
        </div>
    );
};

export default observer(Radar);
