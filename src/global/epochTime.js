/**
 * It converts a Firebase Timestamp object to a human readable date string
 * @param value - The value of the cell.
 * @returns The date in the format of dd/mm/yyyy hh:mm:ss
 */
export function convertEpoch(value) {
    if (!value) {
        return "Not Available"
    } else if (value === "Not Available") {
        return value;
    }

    return new Intl.DateTimeFormat('en-SG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
        .format(value.seconds * 1000)
}