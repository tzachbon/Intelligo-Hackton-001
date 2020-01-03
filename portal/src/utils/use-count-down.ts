import { useEffect, useState } from "react";


export class CountDate {
    now: Date;
    seconds: number | any
    minutes: number | any;
    hours: number | any;
    days: number | any;

    private difference: number

    get isValid() {
        return !!this.difference;
    }

    constructor(public date: Date | null) {
        this.now = new Date();
        this.difference = date instanceof Date ? (this.now.getTime() - (this.date as any).getTime()) : 0;
        this.setTime(this.difference);
    }


    setTime(difference: number) {
        if (difference > 0) {
            this.seconds = Math.floor(difference / 1000);
            this.minutes = Math.floor(this.seconds / 60);
            this.hours = Math.floor(this.minutes / 60);
            this.days = Math.floor(this.hours / 24);

            this.hours %= 24;
            this.minutes %= 60;
            this.seconds %= 60;
        } else {
            this.seconds = 0;
            this.minutes = 0;
            this.hours = 0;
            this.days = 0;
        }
    }

    toString() {
        return `${this.days} days ${this.hours} hours ${this.minutes} minutes ${this.seconds} seconds`;
    }

    asObject(showDay = true) {
        const {
            days,
            hours,
            minutes,
            seconds
        } = { ...this };

        const obj = {
            hours,
            minutes,
            seconds
        }

        if (showDay) {
            Object.assign(obj, { days });
        }

        return obj
    }
}

export default function useCountDown(initTime: Date): [CountDate, (newDate?: Date) => void] {
    let unMount = false;
    const [date, setDate] = useState(initTime);
    const [time, setTime] = useState(new CountDate(date));
    const [timer, setTimer] = useState(null);

    const setCountDownTime = (newTime?: Date | null) => {
        setDate(newTime as any);
        if (timer || !newTime) {
            clearInterval(timer as any);
        }
    }

    useEffect(() => {
        setTime(new CountDate(date))

        if (date) {
            if (timer) {
                clearInterval(timer as any)
            }
            setTimer(
                setInterval(() => {
                    !unMount && setTime(new CountDate(date))
                }, 1000) as any
            )
        }
    }, [date])

    useEffect(() => {

        return () => {
            unMount = true
            clearInterval(timer as any);
        };
    }, [])


    return [time, setCountDownTime]
}