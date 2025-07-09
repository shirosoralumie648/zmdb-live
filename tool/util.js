import moment from 'moment';

export const fromMilliseconds = (milliseconds) => {
    const ms = parseInt(milliseconds % 1000);
    const seconds = parseInt(milliseconds / 1000);
    const ss = parseInt(seconds % 60);
    const minutes = parseInt(seconds / 60);
    const mm = parseInt(minutes % 60);
    const hh = parseInt(minutes / 60);
    return `${hh.toString().padStart(2, 0)}:${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)},${ms.toString().padStart(3, 0)}`;
}

export const toSeconds = (str) => {
    const t = moment(str, 'HH:mm:ss.SSS');
    console.log(`h:${t.hours()},m:${t.minutes()},s:${t.seconds()},ms:${t.milliseconds()}`);
    let r = 0;
    r += t.milliseconds() / 1000;
    r += t.seconds();
    r += t.minutes() * 60;
    r += t.hours() * 60 * 60;
    return r;
}