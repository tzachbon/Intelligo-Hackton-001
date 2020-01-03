import GoogleMapReact, { Coords } from 'google-map-react';
import { observer, useLocalStore } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import FingerPrint from '../FingerPrint/FingerPrint';
import * as firebase from 'firebase';
import { useStores } from '../../store/contexts.store';
import useCountDown, { CountDate } from '../../utils/use-count-down';
import CountTime from '../CountTime/CountTime';

export interface MapProps {
    zoom?: number;
    center?: Coords;
}

const K_WIDTH = 40;
const K_HEIGHT = 40;

const pointStyle = {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    position: 'absolute',
    left: -K_WIDTH / 2,
    top: -K_HEIGHT / 2,

    borderRadius: K_HEIGHT,
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#3f51b5',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4
};


const Map: React.FC<MapProps> = props => {
    const {
        store
    } = useStores();

    const [time, setTime] = useCountDown(null as unknown as Date);

    const defaultCenter = props.center || {
        lat: 32.086580,
        lng: 34.856350
    };

    useEffect(() => {
        firebase
            .firestore()
            .collection('user-time')
            .doc(`${(store && store.user && store.user.uid) || ''}`)
            .get()
            .then(res => {
                store.dates = (res.data() as any).dates as any[];

                if (!store.init) {
                    return;
                } else {
                    store.init = false;
                }

                const lastDate = store.dates[store.dates.length - 1];

                if (lastDate && lastDate.isFinished) {
                    store.date = null
                } else {
                    store.date = lastDate;
                    setTime(new Date(store.date.start))
                }
            })
    }, [])

    useEffect(() => {
        if (time) {
            store.time = time;
            if (store.dates.length) {
                const lastDate = store.dates[store.dates.length - 1];
                if (lastDate.isFinished) {
                    store.dates.push({
                        start: Date.now(),
                        isFinished: false,
                        end: null
                    })

                    firebase
                        .firestore()
                        .collection('user-time')
                        .doc(`${(store && store.user && store.user.uid) || ''}`)
                        .set({
                            dates: store.dates
                        })
                        .then(res => {
                            console.log(res);
                        })
                }
            }

            // if () {


            //     if (!lastDate.isFinished) {
            //         lastDate.start = Date.now();
            //         store.dates[store.dates.length - 1] = lastDate;
            //     }

            //     firebase
            //         .firestore()
            //         .collection('user-time')
            //         .doc(`${(store && store.user && store.user.uid) || ''}`)
            //         .set({
            //             dates: store.dates
            //         })
            //         .then(res => {
            //             console.log(res);
            //         })
            // }
        }
    }, [time])

    useEffect(() => {
        if (!store.time) {
            store.loading = true;
            setTime(null as unknown as any);
            firebase
                .firestore()
                .collection('user-time')
                .doc(`${(store && store.user && store.user.uid) || ''}`)
                .set({
                    dates: store.dates
                })
                .then(res => {
                    console.log(res);
                })
                .finally(() => store.loading = false)
        }

    }, [store.time])

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDfpAmZDLi4rjNokRs-moqxy0zbfXFViuo' }}
                defaultCenter={defaultCenter}
                draggable={false}
                defaultZoom={props.zoom || 0}
            >
                {
                    !!(store.time && (store.time as CountDate).isValid) ? (
                        <CountTime></CountTime>
                    ) : (
                            <FingerPrint style={pointStyle} updateTime={() => {
                                const now = Date.now()
                                setTime(new Date(now))
                            }}></FingerPrint>
                        )
                }

            </GoogleMapReact>
        </div>
    );
}


// <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAAWrAS-iJ1UKhD4qTCj6C0so3SsuG9ccs&callback=initMap"
//     type="text/javascript"></script>
export default observer(Map);