export { Countdown, DHMS };

import { Timer } from './timer.js';

const counterNames = ["days", "hours", "minutes", "seconds"];

type DHMS = {
    isFuture: boolean,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
}

class Countdown {
    date: Date;
    counters: Map<string, HTMLElement> = new Map();

    constructor(dateString: string) {
        this.date = new Date(dateString);
    }

    attach(parent: HTMLElement) {
        parent.insertAdjacentHTML('beforeend', this.htmlTemplate());
        const counterContainer = parent.children[0];
        const endDate = parent.children[1];
        endDate.textContent = this.asLocalDateTime();

        for (let name of counterNames) {
            this.counters.set(name, counterContainer.querySelector(`.${name} > p`)!);
        }

        const t = new Timer(1, () => {
            const dhms = this.dhms();

            for (let name of counterNames) {
                const value = dhms[name as keyof DHMS].toString();
                // console.log(`Setting ${name} to ${value}`);
                this.counters.get(name)!.innerText = value;
            }
        });
    }

    asLocalDateTime() {
        const dateFmt = new Intl.DateTimeFormat("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
        const timeFmt = new Intl.DateTimeFormat("en-US", { timeStyle: "short" });
        const dateTime = dateFmt.format(this.date);
        return `${dateFmt.format(this.date)} at ${timeFmt.format(this.date)}`;
    }

    isFuture(now: Date = new Date()): boolean {
        return this.date > now;
    }

    dhms(now: Date = new Date()): DHMS {
        const dir = this.date >= now ? 1 : -1;
        let secs = Math.floor(dir * (this.date.getTime() - now.getTime()) / 1000);
        const days = Math.floor(secs / 86400);
        secs -= days * 86400;
        const hours = Math.floor(secs / 3600);
        secs -= hours * 3600;
        const minutes = Math.floor(secs / 60);
        secs -= minutes * 60;
        const seconds = Math.floor(secs);
        return { isFuture: dir === 1, days, hours, minutes, seconds };
    }

    htmlTemplate(): string {
        return `
            <div class="countdown">
                <div class="days">
                    <p></p>
                    <p>Days</p>
                </div>
                <div class="hours">
                     <p></p>
                     <p>Hrs</p>
                </div>
                <div class="minutes">
                    <p></p>
                    <p>Min</p>
                </div>
                <div class="seconds">
                    <p></p>
                    <p>Secs</p>
                </div>
            </div>
            <div class="countdown-date">
            </div>
        `;
    }
}
