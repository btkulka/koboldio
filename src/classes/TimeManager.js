export default class TimeManager {
    constructor(props){
        // public methods
        this.convertToTick = this.convertToTick.bind(this);
    }

    // converts a time object to total milliseconds
    convertToTick(time) {
        let tick = 0;
        tick += (time.ms ?? 0);
        tick += ((time.s ?? 0) * 1000);
        tick += ((time.m ?? 0) * 60 * 1000);
        tick += ((time.h ?? 0) * 60 * 60 * 1000);
        tick += ((time.d ?? 0) * 24 * 60 * 60 * 1000);
        tick += ((time.month) ?? 0 * 24 * 28 * 60 * 60 * 1000);
        tick += ((time.y ?? 0) * 12 * 24 * 28 * 60 * 60 * 1000);

        return tick;
    }

}