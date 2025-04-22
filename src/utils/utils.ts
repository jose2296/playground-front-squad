export const getRandomOptionByNumberKey = <T>(options: T[], key: keyof T): T => {
    const total = options.reduce((sum, opc) => sum + (opc[key] as number), 0);
    let random = Math.random() * total;

    for (const opc of options) {
        if (random < (opc[key] as number)) {
            return opc;
        }
        random -= (opc[key] as number);
    }

    return options[0];
};

// Algorithm Fisher-Yates
export const shuffleItems = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};


export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
    return array.reduce(function(acc, item) {
        (acc[item[key]] = acc[item[key]] || []).push(item);

        return acc;
    }, {} as any);
};

export const getRandomRangeNumber = (min: number, max: number): number => {
    if (min > max) [min, max] = [max, min];
    const hasDecimals = (min % 1 != 0) || (max % 1);

    if (hasDecimals) {
        return Math.random() * (max - min) + min;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const handleModalState = (modalId: string, state: 'showModal' | 'close') => {
    (document.getElementById(modalId) as HTMLDialogElement)[state]();
};
