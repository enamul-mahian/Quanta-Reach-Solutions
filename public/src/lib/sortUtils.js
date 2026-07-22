/**
 * Converts Firestore Timestamp, Date, ISO string, or number values into milliseconds.
 * Invalid or missing values are sorted as the oldest records.
 */
export const toMillis = (value) => {
    if (value == null)
        return 0;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    if (value instanceof Date) {
        const timestamp = value.getTime();
        return Number.isFinite(timestamp) ? timestamp : 0;
    }
    if (typeof value === 'object') {
        const possibleTimestamp = value;
        if (typeof possibleTimestamp.toMillis === 'function') {
            try {
                const timestamp = possibleTimestamp.toMillis();
                return Number.isFinite(timestamp) ? timestamp : 0;
            }
            catch {
                return 0;
            }
        }
        if (typeof possibleTimestamp.seconds === 'number') {
            return possibleTimestamp.seconds * 1000;
        }
    }
    if (typeof value === 'string') {
        const timestamp = Date.parse(value);
        return Number.isFinite(timestamp) ? timestamp : 0;
    }
    return 0;
};
export const safeNumber = (value, fallback = 0) => {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};
