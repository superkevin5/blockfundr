// import { format, utcToZonedTime } from 'date-fns-tz'; // Import from date-fns-tz for time zone support

export function formatTimestampToLocalDateTime(timestamp: string): string {

    if(!timestamp) return ''
    // Parse the timestamp string to a Date object
    const date = new Date(timestamp);

    // Get the local date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');

    // Get the local time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Format the local date and time string
    const localDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    if (isNaN(year)) {
        return ''
    }
    return localDateTime;
}


// const formatDateToUTCString = (date) => {
//     const utcDate = utcToZonedTime(date, 'UTC'); // Convert to UTC time zone
//     return format(utcDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"); // Format as UTC string
// };
//


// @ts-ignore
export function isDigitNumber(input) {
    // Regular expression to match digits, optionally followed by a dot and more digits
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    return regex.test(input);
}
