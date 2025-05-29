import { child, get, getDatabase, ref, set } from 'firebase/database';
import { getRandomRangeNumber } from './utils';

export type Player = {
    name: string;
    color: string;
    score: number;
};

export const saveTodayScores = (todayData: Player[]) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

    const db = getDatabase();
    const today = new Date().getDate();
    set(ref(db, `scores/${month}/${today}`), todayData);

    get(child(ref(db), `scores/${month}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const { summary }: { [month: string]: Player[]; summary: Player[] } = snapshot.val();
            if (summary) {
                todayData.forEach(user => {
                    const summaryUserDataIndex = summary.findIndex(summaryUser => summaryUser.name === user.name);
                    if (summaryUserDataIndex !== -1) {
                        summary[summaryUserDataIndex].score += user.score;
                    } else {
                        summary.push(user);
                    }
                });
                set(ref(db, `scores/${month}/summary`), summary);
            } else {
                set(ref(db, `scores/${month}/summary`), todayData);
            }
        } else {
            set(ref(db, `scores/${month}/summary`), todayData);
        }
    }).catch((error) => {
        console.error(error);
    });
};

export const applySpecialEvent = async (event: string) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
    const db = getDatabase();
    const summaryData = await get(child(ref(db), `scores/${month}`));

    if (!summaryData.exists()) {
        console.log('No data available for ' + month);
        return;
    }

    const { summary }: { [month: string]: Player[]; summary: Player[] } = summaryData.val();
    const newSummaryData = getSummaryDataToSpecialEvent(event, summary);
    console.log('New summary data:', newSummaryData);

    set(ref(db, `scores/${month}/summary`), newSummaryData);
};

const getSummaryDataToSpecialEvent = (event: string, summary: Player[]) => {
    switch (event) {
        case 'the-last-will-be-first':
            return theLastWillBeFirst(summary);
        case 'zero-patatero':
            return summary.map(user => ({...user, score: 0 }));
        case 'random-points':
            return summary.map(user => ({...user, score: getRandomRangeNumber(0, Math.max(...summary.map(({ score }) => score))) }));
        default:
            return summary;
    }
};

const theLastWillBeFirst = (summary: Player[]) => {
    const sortedScores = [...summary].sort((a, b) => b.score - a.score);
    return summary.map(user => ({
        ...user,
        score: sortedScores[summary.length - 1 - sortedScores.findIndex(sortedUser => sortedUser.name === user.name)].score
    }));
};
//     "slug": "tonto-el-ultimo",
//     "active": true
// },
// {
//     "name": "Cero patatero",
//     "slug": "cero-patatero",
//     "active": true
// },
// {
//     "name": "Empujoncito",
//     "slug": "empujoncito",
//     "active": false
// },
// {
//     "name": "Puntos random",
//     "slug": "random-points",
