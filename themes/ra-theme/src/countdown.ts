export { Countdown };

class Countdown {
    date: Date;

    constructor(dateString: string) {
        this.date = new Date(dateString);
    }

    asLocalDateTime() {
        const dateFmt = new Intl.DateTimeFormat("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
        const timeFmt = new Intl.DateTimeFormat("en-US", { timeStyle: "short" });
        const dateTime = dateFmt.format(this.date);
        return `${dateFmt.format(this.date)} at ${timeFmt.format(this.date)}`;
    }
}
