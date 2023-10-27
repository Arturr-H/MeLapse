import AsyncStorage from "@react-native-async-storage/async-storage";

/* Constants */
const STREAK_KEY: string = "streak";
const DATE_KEY: string = "dates";

/* Interfaces */
interface DateValue {
    month: number, day: number, year: number
}
interface StreakValue {
    lastModified: DateValue,
    streakCount: number
}

/** Keep track of users streak */
export default class StreakHandler {
    private constructor() {}

    /** Get current streak */
    static async getCurrent(): Promise<number> {
        try {
            const number = parseInt(await AsyncStorage.getItem(STREAK_KEY) ?? "!");
            return Number.isNaN(number) ? 0 : number;
        }catch {
            return 0
        }
    }

    /** Set streak (try to), returns `StreakValue` or null if nothing changed */
    static async tryIncrement(): Promise<StreakValue | null> {
        this.clearPrevDate();
        const date = new Date();
        const prevDate: DateValue | null = await this.getPrevDate();
        const currentDate: DateValue = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        };

        /* Increase date and streak */
        const increase = async (): Promise<StreakValue> => {
            await this.setPrevDate(currentDate);
            return {
                streakCount: await this.getAndIncreaseStreak(),
                lastModified: currentDate,
            }
        }
        /* Reset streak */
        const reset = async (): Promise<StreakValue> => {
            await this.setPrevDate(currentDate);
            await this.setStreak(1);
            return {
                streakCount: 1,
                lastModified: currentDate,
            }
        }

        /* If its not been set */
        if (prevDate === null) {
            console.log("[DBG~Streak] Initializing streak");
            return reset();
        }

        /* If it has been set but it's the same day */
        else if (sameDate(prevDate, currentDate)) {
            console.log("[DBG~Streak] Same streak");
            return null;
        };

        /* Try increase */
        const deltaDate = getDeltaDate(currentDate, prevDate);
        const dayOne = currentDate.day === 1;
        const monthOne = currentDate.month === 1;

        /* Increase in year (and start to 1 jan) */
        if (deltaDate.year !== 0) {
            if (deltaDate.year === 1 && dayOne && monthOne) return increase();
            else return reset();
        }
        /* Increase in month */
        else if (deltaDate.month !== 0) {
            if (deltaDate.month === 1 && dayOne) return increase();
            else return reset();
        }
        /* Increase in day */
        else if (deltaDate.day === 1) return increase();
        else return reset();
    }

    /** Get the previous month, day and year */
    private static async getPrevDate(): Promise<DateValue | null> {
        try {
            const v = await AsyncStorage.getItem(DATE_KEY);
            if (v) {
                const dateObject = JSON.parse(v);
                const { day, year, month } = dateObject;

                if (day && year && month) return { day, year, month };
                else return null;
            }
            else return null;
        }catch {
            return null;
        }
    }

    /** Set the previous date */
    private static async setPrevDate(dateObject: DateValue): Promise<void> {
        try {
            await AsyncStorage.setItem(DATE_KEY, JSON.stringify(dateObject));
        }catch {}
    }
    private static async clearPrevDate(): Promise<void> {
        try {
            await AsyncStorage.removeItem(DATE_KEY);
        }catch {}
    }

    /** Increase streak */
    private static async getAndIncreaseStreak(): Promise<number> {
        const streak = parseInt(await AsyncStorage.getItem(STREAK_KEY) ?? "0");
        const newStreak = streak + 1;
        await this.setStreak(newStreak);
        return newStreak;
    }
    private static async setStreak(to: number): Promise<void> {
        await AsyncStorage.setItem(STREAK_KEY, to.toString());
    }
}

/** Compares two `DateValue`s and
 *  returns wether they are the same */
function sameDate(d1: DateValue, d2: DateValue): boolean {
    return d1.day === d2.day &&
            d1.month === d2.month && 
            d1.year === d2.year
}
function getDeltaDate(d1: DateValue, d2: DateValue): DateValue {
    return {
        day: d1.day - d2.day,
        month: d1.month - d2.month,
        year: d1.year - d2.year
    }
}