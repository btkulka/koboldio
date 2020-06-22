export default class ClockTime {
    constructor(ms = 0, s = 0, m = 0, h = 0, d = 0, month = 0, y = 0) {
        // members
        this.ms = ms;
        this.s = s;
        this.m = m;
        this.h = h;
        this.d = d;
        this.month = month;
        this.y = y;
    }
}