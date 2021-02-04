export const daysinMonthOf: any = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

export const months: any = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

export function getDate(){
    const date = new Date();
    const month = Number(date.getMonth() + 1);
    const day = date.getDate();
    const year = date.getFullYear();
    return `${months[month]} ${day}, ${year}`;
}

