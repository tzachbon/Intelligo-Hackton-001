import { useEffect, useState } from "react";


export class CountDate {
    now: Date;
    seconds: number
    minutes: number;
    hours: number;
    days: number;

    private difference: number

    constructor(public date: Date) {
        this.now = new Date();
        this.difference = this.now.getTime() - this.date.getTime();
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

    asObject() {
        const {
            days,
            hours,
            minutes,
            seconds
        } = { ...this };

        return {
            days,
            hours,
            minutes,
            seconds
        }
    }
}

export default function useCountDown(initTime?: Date): [CountDate, (newDate?: Date) => void] {
    initTime = initTime || new Date();
    const [time, setTime] = useState(new CountDate(initTime));

    const setCountDownTime = (newTime?: Date) => setTime(new CountDate(newTime || initTime))

    useEffect(() => {

        let unMount = false;
        const timer$ = setInterval(() => !unMount && setTime(new CountDate(initTime)), 1000);

        return () => {
            unMount = true
            clearInterval(timer$);
        };
    }, [])



    return [time, setCountDownTime]
}