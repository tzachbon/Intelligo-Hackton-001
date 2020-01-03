import * as React from 'react';
import './MyWork.scss';
import { useStores } from '../../store/contexts.store';
import moment from 'moment';
import * as firebase from 'firebase';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import AddManually from '../AddManually/AddManually';

interface IMyWorkProps {
}

const MyWork: React.FunctionComponent<IMyWorkProps> = (props) => {
    const {
        store
    } = useStores()

    React.useEffect(() => {
        firebase
            .firestore()
            .collection('user-time')
            .doc(`${(store && store.user && store.user.uid) || ''}`)
            .get()
            .then(res => {
                store.dates = (res.data() as any).dates as any[];
            })
    }, [])

    return (
        <>
            <div className="my-work-container">
                <div className="row header">
                    <span className="date">Date</span>
                    <span className="start">Start</span>
                    <span className="end">End</span>
                    <span className="total">Total</span>
                </div>
                <div className="row-container">
                    {
                        !!store.dates && (store.dates as { start: number, isFinished: boolean, end: number }[])
                            .reverse()
                            .map(({ start, isFinished, end }, i) => (
                                <div key={`${start.toString()}`} className={classNames('row', { odd: i % 2 !== 0 })}>
                                    <span className="date">{moment(new Date(start)).format('MM/DD')}</span>
                                    <span className="start">{moment(new Date(start)).format('hh:mm')}</span>
                                    <span className="end">{!isFinished ? 'Working...' : moment(new Date(end)).format('hh:mm')}</span>
                                    <span className="total">{isFinished ? (Math.abs(start - end) / 60000).toFixed(2) + ' Min' : ''}</span>
                                </div>
                            ))
                    }
                </div>
            </div>
            <AddManually></AddManually>
        </>
    );
};

export default observer(MyWork);
