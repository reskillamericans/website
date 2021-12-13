export { Timer };

// Accurate and efficient low-resolution (animation)
// timer.  See https://youtu.be/MCi6AZMkxcU.
class Timer {
    // Interval in seconds.
    interval: number;

    // Start time in ms (based on performance.now).
    start: number;

    // Start time (ms) based on Date.now - used for callback.
    startDate: number;

    callback: (ms: number) => void;

    constructor(interval: number, callback: (ms: number) => void) {
        this.interval = interval;
        this.callback = callback;
        this.startDate = Date.now();
        this.start = performance.now();
        this.frame(this.start);
    }

    frame(time: number) {
        if (this.interval === 0) {
            return;
        }

        const elapsed = time - this.start;
        const seconds = Math.round(elapsed / 1000);
        this.callback(this.startDate + seconds * 1000);
        const target = this.start + (seconds + this.interval) * 1000;
        setTimeout(() => requestAnimationFrame((time) => this.frame(time)),
            target - performance.now());
    }

    cancel() {
        this.interval = 0;
    }
}