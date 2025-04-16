export const getRandomOptionByNumberKey = <T>(options: T[], key: keyof T): T => {
    const total = options.reduce((sum, opc) => sum + (opc[key] as number), 0);
    let random = Math.random() * total;
    
    for (const opc of options) {
        if (random < (opc[key] as number)) {
            return opc
        };
        random -= (opc[key] as number);
    }

    return options[0];
};

export const shuffleItems = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};