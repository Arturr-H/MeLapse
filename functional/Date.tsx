
/* Converts unix time to ex "jan 15 2020" */
export function formatDate(unixTime?: number): string {
    if (!unixTime) return "-";

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date(unixTime);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day} ${year}`;
}
