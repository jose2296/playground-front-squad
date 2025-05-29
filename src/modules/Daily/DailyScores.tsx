import { useRouletteStore } from '@/store';
import { saveTodayScores } from '@/utils/firebase';
import { handleColor } from '@/utils/utils';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import RouletteItem from './Roulette/Roulette-item';

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
    const { selectedItem } = useRouletteStore();

    useEffect(() => {
        getSummaryData();
    }, []);

    const getSummaryData = () => {
        const db = getDatabase();
        const monthSummaryRef = ref(db, `scores/${month}/summary`);
        onValue(monthSummaryRef, (snapshot) => {
            const data: Player[] = snapshot.val();
            if (data) {
                setSummary(data.sort((a, b) => a.score < b.score ? 1 : -1));
            }
        });
    };

    addEventListener('message', ({ data }: { data: { type: string; data: Player[] } }) => {
        if (data.type === 'finishRace') {
            saveTodayScores(data.data);
        }
    });

    return (
        <div className='flex flex-col flex-1 gap-4 items-center justify-center'>
            <h1 className='text-center px-4 text-3xl border-b-2 pb-2'>{month}</h1>

            {!summary.length &&
                <p>No data yet.</p>
            }

            <div className='flex flex-col w-full px-10 gap-3'>
                {summary.map((user, index) => (
                    <motion.div layout transition={{ duration: 0.6 }} className='flex gap-2 text-xl justify-between' key={user.name}>
                        <div className='flex gap-2 items-center'>
                            {index + 1} -
                            <div className='rounded-full w-6 h-6' style={{ backgroundColor: handleColor(user.color) }}></div>
                            {user.name}
                        </div>
                        <CountUp end={user.score} duration={2} />
                    </motion.div>
                ))}
            </div>

            {selectedItem &&
                <div className='flex flex-col items-center justify-center p-4'>
                    <h3 className='text-xl border-b-2'>Current game</h3>
                    <RouletteItem data={selectedItem} />
                    {selectedItem?.modifier &&
                        <p>
                            {selectedItem.modifier.name}
                        </p>
                    }
                    {selectedItem?.event &&
                        <p className='text-lg'> Evento especial:
                            <span className=' font-bold'>{selectedItem.event.name}</span>
                        </p>
                    }
                </div>
            }
        </div>
    );
};

export default DailyScores;
