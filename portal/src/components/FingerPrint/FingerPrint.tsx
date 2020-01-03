import * as React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './FingerPrint.scss';
import Radar from '../Radar/Radar';
import classNames from 'classnames';

interface IFingerPrintProps {
    updateTime: (newDate?: Date) => void
    style: any
}

const FingerPrint: React.FunctionComponent<IFingerPrintProps> = (props) => {

    const store = useLocalStore(() => ({ click: false }))
    const {
        updateTime,
    } = props;


    const onMouseEvent = (state: boolean) => () => {
        store.click = state;

        if (!state) {
            updateTime();
        }

    }

    return (
        <div className="finger-print-container " onMouseDown={onMouseEvent(true)} onMouseUp={onMouseEvent(false)}>
            <svg className={classNames({ click: store.click })} width="100" height="100" viewBox="0 0 22 22">
                <g className="empty" fill="none" fillRule="evenodd" stroke="#daf6ff" strokeWidth="0.75">
                    <path d="M3.54 18.57a7.25 7.25 0 0 0 1.04-4.03c-.19-1.36 0-1.53-.34-3.13-.33-1.6 2.02-8.16 7.86-6.51"></path>
                    <path d="M13.44 5.5c3.14 1.87 5.13 5.05 3.41 13.6"></path>
                    <path d="M6.22 20.51c.89-1.6 1.71-3.74 1.55-5.9-.17-2.16-.92-4.25.78-5.66"></path>
                    <path d="M1.51 8.26a10.2 10.2 0 0 0 .08 6.63"></path>
                    <path d="M10.2 1.5h-.6C5.59 1.91 3.3 3.91 2 6.9"></path>
                    <path d="M20.27 11.5a9.83 9.83 0 0 0-8.44-9.86"></path>
                    <path d="M9.71 8.25c.16-.1-.1-.08.99-.25 1.09-.17 3.83.86 3.4 6.7-.42 5.82-1.01 5.97-1.23 6.38"></path>
                    <path d="M9.3 21.48c.27-.52.8-1.7.8-2.05"></path>
                    <path d="M10.6 17.59c.38-1.74.64-3.78-.15-6.57"></path>
                </g>
            </svg>
        </div>
    );
};

export default observer(FingerPrint);
