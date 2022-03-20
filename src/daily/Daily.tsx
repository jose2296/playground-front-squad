import { useState } from 'react';
import './Daily.sass';

export const DailyShuffle = () => {
    const [users, setUsers] = useState(['Jose', 'Chris', 'Jorge', 'Fio']);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');

    const cards = [...Array(10)];
    const start = () => {
        setDropState('no-dealing')
        setState('shuffling');
        setTimeout(() => {
            const usersClone = [...users].sort(() => Math.random() - 0.5);
            setUsers(usersClone);
            setState('shuffled');

            setTimeout(() => {
                setDropState('dealing')
                setTimeout(() => {
                    setDropState('distributed');
                }, 1500);
            }, 500)
        }, ((cards.length - 1) * 250) + 500);
    }

    return (
        <div className="container">
            <div className="buttons">
                <button className="button" onClick={start}>
                    <span>Start</span>
                </button>
            </div>

            <div className="cards">
                { cards.map((_, index) =>
                    <div
                        onClick={start}
                        className={state === 'shuffling' ? 'card flip animate' : 'card flip'}
                        style={{
                            left: 50 + -(index * 1) + 'px',
                            top: 140 + -(index * 1) + 'px',
                            animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                        }}
                        key={`card-${index}`}
                    >
                        <div className="inner">
                            <div className="front">
                                <div className="text"></div>
                            </div>
                            <div className="back"></div>
                        </div>
                    </div>
                )}
                { state === 'shuffled' && <div className="order" >
                    { users.map((user, index) => (
                        <div
                            className={dropState === 'distributed' ? 'card' : 'card flip-reverse'}
                            key={`user-card-${user}`}
                            style={{
                                left: (dropState === 'dealing' || dropState === 'distributed') ? (index * 200) + 'px' : '-100px',
                                transitionDelay: -(index * 0.25) + ((users.length - 1) * 0.25) + 's',
                            }}
                        >
                            <div className="inner"
                                 style={{
                                    transitionDelay: -(index * 0.75) + ((users.length - 1) * 0.75) + 's',
                                }}
                            >
                                <div className="front">
                                    <div className="text">{user}</div>
                                </div>
                                <div className="back"></div>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}
