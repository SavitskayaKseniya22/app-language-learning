export function getRandom(min: number, max: number) {
    return Math.trunc(Math.random() * (max + 1 - min) + min);
}

export function getPercent(total: number, fraction: number) {
    return Math.round((fraction / total || 0) * 100);
}
