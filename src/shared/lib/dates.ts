export function makeLineFromParcedTime({ time }: { time: number }) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(minutes / 60);

    const hoursString = hours.toString().length === 1 ? `0${hours}` : `${hours}`;
    const minutesString = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`;

    return `${hoursString}:${minutesString}:${secondsString}`;
}
