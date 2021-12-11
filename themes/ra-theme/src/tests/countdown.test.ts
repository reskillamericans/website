import { assert } from 'chai';

import { Countdown } from '../countdown.js';

process.env.TZ = 'America/Los_Angeles';

suite("Countdown", () => {
    test('asLocalDateTime', () => {
        const c = new Countdown("2022-02-07T08:00-08:00");
        assert.equal(c.asLocalDateTime(), "Monday, February 7, 2022 at 8:00 AM");
    });
});
