import './Game.sass'
import { child, get, getDatabase, onValue, ref, set } from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { useEffect, useState } from 'react';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "playground-front-squad.firebaseapp.com",
    databaseURL: "https://playground-front-squad-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "playground-front-squad",
    storageBucket: "playground-front-squad.firebasestorage.app",
    messagingSenderId: "1062531853245",
    appId: "1:1062531853245:web:4a386c7fd9e1394bda00d4"
}
initializeApp(firebaseConfig);

const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());

type Player = {
    name: string; 
    color: string; 
    score: number;
}

const groupBy = (array: any[], key: string): {} => {
    return array.reduce(function(acc, item) {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
};

const Game = () => {
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
    
    window.addEventListener('message', ({ data }: { data: { type: string; data: Player[] }}) => {
        if (data.type === 'finishRace') {
            finishRace(data.data)
        }
    });

    const finishRace = (result: Player[]) => {
        const db = getDatabase();
        const today = new Date().getDate();
        set(ref(db, `scores/${month}/${today}`), result);

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
                    }
                }, {} as { [userName: string]: Player })

                set(ref(db, `scores/${month}/summary`), Object.values(summaryPerUser));
            } else {
                set(ref(db, `scores/${month}/summary`), result);
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    return (
        <div className="game-container">
            <iframe src="/game-build/index.html" width={'500px'} height={'900px'} />
            <div className="score-container">
                <h1>{ month }</h1>

                {!summary.length && 
                    <p>No data yet.</p>
                }
                <div className="users">
                    {summary.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        <div className="user" key={user.name}>
                            <div className="name">
                                {index + 1}
                                <div className="color" style={{ backgroundColor: `#${user.color}` }}></div>
                                {user.name}
                            </div>
                            <div className="score">{user.score}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Game;