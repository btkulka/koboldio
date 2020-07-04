import { MONTHS, WEEKDAYS } from '../constants/CalendarNames';
import ClockTime from '../models/clock-time';
import { RECUR_MEASURES, CAMPAIGN_DAY_ONE } from '../constants/EventConstants';

const blank_time = new ClockTime();

export default class TimeManager {
    constructor(date){

        // members
        this.currentDate = date;

        // public methods
        this.convertToTick = this.convertToTick.bind(this);
        this.getOrdinal = this.getOrdinal.bind(this);
        this.getDateString = this.getDateString.bind(this);
        this.getTimeString = this.getTimeString.bind(this);
        this.getDateTimeString = this.getDateTimeString.bind(this);
        this.isEarlier = this.isEarlier.bind(this);
        this.isLater = this.isLater.bind(this);
        this.passTime = this.passTime.bind(this);
        this.getDateFromCampaignDay = this.getDateFromCampaignDay.bind(this);
        this.subtractTime = this.subtractTime.bind(this);
    }

    // adds time to a base time, returns new time
    addTime(baseTime, time = blank_time) {
        let newTime = {
            y: (time.y ?? 0) + baseTime.y,
            month: (time.month ?? 0) + baseTime.month,
            d: (time.d ?? 0) + baseTime.d,
            h: (time.h ?? 0) + baseTime.h,
            m: (time.m ?? 0) + baseTime.m,
            s: (time.s ?? 0) + baseTime.s,
            ms: (time.ms ?? 0) + baseTime.ms
        };

        if (newTime.ms >= 1000){
            newTime.s += Math.floor(newTime.ms / 1000);
            newTime.ms = newTime.ms % 1000;
        }
        if (newTime.s >= 60) {
            newTime.m += Math.floor(newTime.s / 60);
            newTime.s = newTime.s % 60;         
        }
        if (newTime.m >= 60) {
            newTime.h += Math.floor(newTime.m / 60);
            newTime.m = newTime.m % 60;
        }
        if (newTime.h >= 24) {
            newTime.d += Math.floor(newTime.h / 24);
            newTime.h = newTime.h % 24;
        }
        if (newTime.d > 28) {
            newTime.month += Math.floor(newTime.d / 28);
            newTime.d = newTime.d % 28;
        }
        if (newTime.month > 12) {
            newTime.y += Math.floor(newTime.month / 12);
            newTime.month = newTime.month % 12;
        }

        return newTime;
    }

    // converts a time object to total milliseconds
    convertToTick(time = this.currentDate) {
        let tick = 0;
        tick += (time.ms ?? 0);
        tick += ((time.s ?? 0) * 1000);
        tick += ((time.m ?? 0) * 60 * 1000);
        tick += ((time.h ?? 0) * 60 * 60 * 1000);
        tick += ((time.d ?? 0) * 24 * 60 * 60 * 1000);
        tick += ((time.month ?? 0) * 24 * 28 * 60 * 60 * 1000);
        tick += ((time.y ?? 0) * 12 * 24 * 28 * 60 * 60 * 1000);

        return tick;
    }

    getCampaignDayFromDate(date) {
        let diff = this.subtractTime(date, CAMPAIGN_DAY_ONE);
        let days = 0;
        days += (diff.y * 365);
        days += (diff.month * 28);
        days += (diff.d);
        return days;
    }

    getCampaignDayTimeString(event) {
        return `Day ${event.campaignDay}: ${String(event.date.h).padStart(2, '0')}:${String(event.date.m).padStart(2, '0')}`;
    }

    // gets the date from the campaign day
    getDateFromCampaignDay(campaignDay, time) {
        let retDate = {
            ...CAMPAIGN_DAY_ONE,
            ...time
        };
        retDate = this.addTime(retDate, {
            d: Number(campaignDay)
        });

        return retDate;
    }

    // returns given date string or the manager's current date by default
    getDateString(date = this.currentDate) {
        return `${this.getOrdinal(date.d)} day of ${MONTHS[date.month]}, Year ${date.y}`;
    }

    // returns given date and time string or the manager's current date and time by default
    getDateTimeString(date = this.currentDate) {
        return `${this.getOrdinal(date.d)} day of ${MONTHS[date.month]}, Year ${date.y} at ${String(date.h).padStart(2, '0')}:${String(date.m).padStart(2, '0')}`;
    }

    getFormalDateTimeString(date = this.currentDate) {
        return `${WEEKDAYS[date.d % 7]}, the  ${this.getOrdinal(date.d)} day of ${MONTHS[date.month]}, Year ${date.y} at ${String(date.h).padStart(2, '0')}:${String(date.m).padStart(2, '0')}`;
    }

    
    // formats a number into its ordinal
    getOrdinal(n) {
        const lastDigit = n % 10;
        switch(lastDigit){
            case 1:
                return n + 'st';
            case 2:
                return n + 'nd';
            case 3:
                return n + 'rd';
            default:
                return n + 'th';
        }
    }

    // returns a time object as defined by its recurring step and measure
    getRecurringTimeStep(step, measure) {
        if (measure === RECUR_MEASURES.days) {
            return {
                d: Number(step)
            };
        } else if (measure === RECUR_MEASURES.hours) {
            return {
                h: Number(step)
            };
        } else if (measure === RECUR_MEASURES.months) {
            return {
                month: Number(step)
            };
        } else if (measure === RECUR_MEASURES.years) {
            return {
                y: Number(step)
            };
        } else {
            return null;
        }
    }

    // returns given time string or the manager's current time by default
    getTimeString(date = this.currentDate) {
        return `${String(date.h).padStart(2, '0')}:${String(date.m).padStart(2, '0')}`;
    }

    
    // returns true if given date is earlier than current date
    isEarlier(date) {
        if (date.y < this.currentDate.y) {
            return true;
        } else if (date.y > this.currentDate.y) {
            return false;
        }

        if (date.month < this.currentDate.month) {
            return true;
        } else if (date.month > this.currentDate.month) {
            return false;
        }

        if (date.d < this.currentDate.d) {
            return true;
        } else if (date.d > this.currentDate.d) {
            return false;
        }

        if (date.h < this.currentDate.h) {
            return true;
        } else if (date.h > this.currentDate.h) {
            return false;
        }

        if (date.m < this.currentDate.m) {
            return true;
        } else if (date.m > this.currentDate.m) {
            return false;
        }

        if (date.s < this.currentDate.s) {
            return true;
        } else if (date.s > this.currentDate.s) {
            return false;
        }

        if (date.ms < this.currentDate.ms) {
            return true;
        } else if (date.ms >= this.currentDate.ms) {
            return false;
        }

        return false;
    }

    // wrapper function: returns true if given date is later than current date
    isLater(date) {
        return !this.isEarlier(date);
    }

    // adds given time to current date, sets new current date, and returns it
    passTime(time = blank_time) {
        let newTime = this.addTime(this.currentDate, time);
        this.currentDate = newTime;
        return newTime;
    }

    // subtract date2 from date1
    subtractTime(date1, date2) {
        let newTime = {
            y: (date1.y ?? 0) - (date2.y ?? 0),
            month: (date1.month ?? 0) - (date2.month ?? 0),
            d: (date1.d ?? 0) - (date2.d ?? 0),
            h: (date1.h ?? 0) - (date2.h ?? 0),
            m: (date1.m ?? 0) - (date2.m ?? 0),
            s: (date1.s ?? 0) - (date2.s ?? 0),
            ms: (date1.ms ?? 0) - (date2.ms ?? 0)
        };

        if (newTime.ms <= -1000){
            newTime.s -= Math.floor(newTime.ms / 1000);
            newTime.ms = newTime.ms % 1000;
        }
        if (newTime.s <= -60) {
            newTime.m -= Math.floor(newTime.s / 60);
            newTime.s = newTime.s % 60;         
        }
        if (newTime.m <= -60) {
            newTime.h -= Math.floor(newTime.m / 60);
            newTime.m = newTime.m % 60;
        }
        if (newTime.h <= -24) {
            newTime.d -= Math.floor(newTime.h / 24);
            newTime.h = newTime.h % 24;
        }
        if (newTime.d < 28) {
            newTime.month -= Math.floor(newTime.d / 28);
            newTime.d = newTime.d % 28;
        }
        if (newTime.month < 12) {
            newTime.y -= Math.floor(newTime.month / 12);
            newTime.month = newTime.month % 12;
        }

        return newTime;
    }
}