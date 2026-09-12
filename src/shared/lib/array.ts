export function shuffle<T>(array: Array<T>): Array<T> {
    const arrayCopy = [...array];
    for (let index = array.length - 1; index > 0; index -= 1) {
        const index_ = Math.floor(Math.random() * (index + 1));
        [arrayCopy[index], arrayCopy[index_]] = [arrayCopy[index_], arrayCopy[index]];
    }
    return arrayCopy;
}

export function convertArray(array: string[]) {
    return array.map(item => ({
        element: item,
        key: Math.random().toString(),
    }));
}
