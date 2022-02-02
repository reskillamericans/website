import { assert } from 'chai';
import { suite, test } from 'mocha';

import { Countdown, DHMS } from '../countdown.js';

process.env.TZ = 'America/Los_Angeles';

suite("Countdown", () => {
    test('asLocalDateTime', () => {
        const c = new Countdown("2022-02-07T08:00-08:00");
        assert.equal(c.asLocalDateTime(), "Monday, February 7, 2022 at 8:00 AM");
    });

    test("dhms - whole UTC days", () => {
        const d1 = new Date("2022-02-07");
        const d2 = new Date("2022-02-01");
        const d3 = new Date(d2);
        d3.setHours(d2.getHours() + 12);
        const c = new Countdown(d1.toISOString());
        assert.equal(Object.keys(c.dhms()).length, 5);
        assert.deepEqual(c.dhms(d1), {isFuture: true, days: 0, hours: 0, minutes: 0, seconds: 0});
        assert.deepEqual(c.dhms(d2), {isFuture: true, days: 6, hours: 0, minutes: 0, seconds: 0});
        assert.deepEqual(c.dhms(d3), {isFuture: true, days: 5, hours: 12, minutes: 0, seconds: 0});

    });

    test("dhms - negative dates", () => {
        const d1 = new Date("2022-02-07");
        const d2 = new Date("2022-02-01");
        const d3 = new Date(d2);
        d3.setHours(d2.getHours() + 12);
        const c = new Countdown(d2.toISOString());
        assert.deepEqual(c.dhms(d1), {isFuture: false, days: 6, hours: 0, minutes: 0, seconds: 0});
        const c3 = new Countdown(d3.toISOString());
        assert.deepEqual(c3.dhms(d1), {isFuture: false, days: 5, hours: 12, minutes: 0, seconds: 0});
    });

    test("isFuture", () => {
        const d1 = new Date("2022-02-07");
        const d2 = new Date("2022-02-01");
        const c = new Countdown(d1.toISOString());
        assert.isTrue(c.isFuture(d2));
        assert.isFalse(c.isFuture(d1));
    });
});
