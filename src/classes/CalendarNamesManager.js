import { WEEKDAYS, MONTHS, SEASONS } from '../constants/CalendarNames';

export default class CalendarNamesManager {
    constructor() {

        // public methods
        this.getWeekday = this.getWeekday.bind(this);
        this.getMonth = this.getMonth.bind(this);
        this.getSeason = this.getSeason.bind(this);
    }

    getWeekday(index) {
        return WEEKDAYS[index];
    }

    getMonth(index) {
        return MONTHS[index];
    }

    getSeason(index) {
        return SEASONS[index];
    }

    getSeasonByMonth(monthIndex) {
        return SEASONS[Math.floor(monthIndex / SEASONS.length)];
    }
}