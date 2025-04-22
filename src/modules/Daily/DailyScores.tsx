import { groupBy } from '@/utils/utils';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'playground-front-squad.firebaseapp.com',
    databaseURL: 'https://playground-front-squad-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'playground-front-squad',
    storageBucket: 'playground-front-squad.firebasestorage.app',
    messagingSenderId: '1062531853245',
    appId: '1:1062531853245:web:4a386c7fd9e1394bda00d4'
};
initializeApp(firebaseConfig);
const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

type Player = {
    name: string;
    color: string;
    score: number;
}

const DailyScores = () => {
    const [summary, setSummary] = useState<Player[]>([]);

    useEffect(() => {
        const db = getDatabase();
        const monthSummaryRef = ref(db, `scores/${month}/summary`);
        onValue(monthSummaryRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSummary(data);
            }
        });
    }, []);

    addEventListener('message', ({ data }: { data: { type: string; data: Player[] } }) => {
        if (data.type === 'finishRace') {
            finishRace(data.data);
        }
    });

    const finishRace = (result: Player[]) => {
        const db = getDatabase();
        const today = new Date().getDate();
        set(ref(db, `scores/${month}/${today}`), result);

        get(child(ref(getDatabase()), `scores/${month}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const { summary, ...monthData }: { [month: string]: Player[]; summary: Player[] } = snapshot.val();
                const users = groupBy<Player>(Object.values(monthData).flat(), 'name');
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
                set(ref(db, `scores/${month}/summary`), result);
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className='flex flex-col flex-1 gap-4 items-center justify-center'>
            <h1 className='text-center px-8 text-3xl border-b-2 rounded-bl-sm rounded-br-sm pb-2'>{month}</h1>

            {!summary.length &&
                <p>No data yet.</p>
            }
            <div className='flex flex-col w-full px-10 gap-2'>
                {summary.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                    <div className='flex gap-2 text-xl justify-between' key={user.name}>
                        <div className='flex gap-2 items-center'>
                            {index + 1} -
                            <div className='rounded-full w-6 h-6' style={{ backgroundColor: `#${user.color}` }}></div>
                            {user.name}
                        </div>
                        <CountUp end={user.score} duration={4} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyScores;
