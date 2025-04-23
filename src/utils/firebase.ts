import { child, get, getDatabase, ref, set } from 'firebase/database';
import { groupBy } from './utils';

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

    get(child(ref(getDatabase()), `scores/${month}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const { summary, ...monthData }: { [month: string]: Player[]; summary: Player[] } = snapshot.val();
            const users: { [userName: string]: Player[] } = groupBy(Object.values(monthData).flat(), 'name');
            const summaryPerUser = Object.entries(users).reduce((acc, [userName, userDataPerDay]) => {
                return {
                    ...acc,
                    [userName]: {
                        name: userDataPerDay?.[0].name || '',
                        color: userDataPerDay?.[0].color || '',
                        score: userDataPerDay?.reduce((total, day) => total + day.score, 0) || 0
                    }
                };
            }, {} as { [userName: string]: Player });

            set(ref(db, `scores/${month}/summary`), Object.values(summaryPerUser));
        } else {
            set(ref(db, `scores/${month}/summary`), todayData);
        }
    }).catch((error) => {
        console.error(error);
    });
};
