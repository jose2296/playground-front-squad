import { useEffect, useRef, useState } from 'react';
import './CardsGame.sass';
import { Item } from '../../Roulette/Roulette';
import clsx from 'clsx';
import FlippingCard from '@/components/FlippingCard';
import Card, { CARD_SIZE } from './Card';
import { motion } from "motion/react";

const CardsGame = ({ mode, modifier }: { mode: string; modifier: Item['modifier'] }) => {
    console.log(mode, modifier);

    const [startPosition, setStartPosition] = useState<{ top: string; left: string }>();
    const [finalPositions, setFinalPositions] = useState<{ top: string; left: string }[]>([]);
    const [users, setUsers] = useState<{name: string; flipped: boolean; }[]>([]);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');
    const deckCardsRef = useRef<HTMLDivElement>();
    const shuffledCardsRef = useRef<HTMLDivElement>();

    const [configUsers, setConfigUsers] = useState(false);
    const [usersForm, setUsersForm] = useState<{name: string; flipped: boolean; }[]>([]);

    const cards = [...Array(10)];

    useEffect(() => {
        const localUsers = localStorage.getItem('users');
        const usersParsed = localUsers ? JSON.parse(localUsers) : [];
        const links = localStorage.getItem('links');

        setUsers(usersParsed);
        setUsersForm(usersParsed);
    }, []);

    const start = () => {
        setDropState('no-dealing')
        setState('shuffling');
        
        if (deckCardsRef.current) {
            const top = deckCardsRef.current.children[0].getClientRects()
            console.log(top[0].top);
            setStartPosition({ left: `${top[0].left}px`, top: `${top[0].top}px` });
        }

        setTimeout(() => {
            const usersClone = [...users].sort(() => Math.random() - 0.5);
            setUsers(usersClone);
            setState('shuffled');

            setTimeout(() => {
                setDropState('dealing')
                        
                if (shuffledCardsRef.current) {
                    const finalPositions = [...shuffledCardsRef.current.children].map(card => {
                        const rect = card.getClientRects();

                        return { left: `${rect[0].left}px`, top: `${rect[0].top}px` };
                    });
                    setFinalPositions(finalPositions);
                }
                
                setTimeout(() => {
                    setDropState('distributed');
                }, users.length * 800);
            }, 500)
        }, ((cards.length - 1) * 250) + 500);
    };

    const openConfig = () => {
        setConfigUsers(true);
    };

    const updateUserForm = (newUserValue: string, index: number) => {
        const _userForm = [...usersForm];
        _userForm[index] = { name: newUserValue, flipped: false };
        setUsersForm([..._userForm]);
    };

    const updateUser = (user: { name: string; flipped: boolean }, index: number) => {
        const _userForm = [...users];
        _userForm[index] = user;
        setUsers([..._userForm]);
    };

    const removeUser = (index: number) => {
        const _users = [...usersForm];
        _users.splice(index, 1);
        setUsersForm([..._users]);
    };

    const saveUsers = () => {
        setState('ready');
        setConfigUsers(false);
        setUsersForm([...usersForm]);
        setUsers([...usersForm]);

        localStorage.setItem('users', JSON.stringify(usersForm));
    };

    const addNewUser = () => {
        setUsersForm([...usersForm, { name: '', flipped: false }])
    };

    const sendScores = () => {

    }

    return (
        <div className="container">
            <div className="flex flex-row gap-10">
                <div className='m-10'>
                    <button className='btn btn-primary btn-xl' onClick={start} disabled={state === 'shuffling'}>
                        Shuffle
                        {state === 'shuffling' && <span className="loading loading-spinner"></span>}
                    </button>
                </div>
                <button className="button" onClick={openConfig}>
                    <span>Config users</span>
                </button>

                {/* TODO: CONDIF Links <button className="button" onClick={openConfig}>
                    <span>Config Links</span>
                </button> */}

                {configUsers &&
                    <div className="config-users">
                        <div className="users">
                            {usersForm.map(((userValue, index) => (
                                <div className="user" key={`config-user-${index}`}>
                                    <input value={userValue.name} onChange={(e) => updateUserForm(e.target.value, index)} />
                                    <button className="button small" onClick={() => removeUser(index)}>
                                        <span>-</span>
                                    </button>
                                </div>
                            )))}
                        </div>

                        <div className="config-buttons">
                            <button className="button small" onClick={addNewUser}>
                                <span>+</span>
                            </button>

                            <button className="button" onClick={saveUsers}>
                                <span>Save</span>
                            </button>

                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row gap-x-10 gap-y-20 p-10 flex-wrap">
                <div ref={deckCardsRef as any} className={clsx(`flex items-center justify-center w-[${CARD_SIZE.width}px] h-[${CARD_SIZE.height}px] relative`)}>
                    {cards.map((_, index) =>
                        <div
                            key={`card-${index}`}
                            className={clsx(`w-[${CARD_SIZE.width}px] h-[${CARD_SIZE.height}px] absolute`, {
                                'animate-shuffle': state === 'shuffling'
                            })}
                            style={{
                                left: -(index * 1) + 'px',
                                top: -(index * 1) + 'px',
                                animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                            }}
                            onClick={start}
                        >
                            <Card avoidFlip={true} className="z-20" />
                        </div>
                    )}
                </div>
                <div>
                    <div className="absolute-card flex gap-10 flex-wrap">
                        {state === 'shuffled' &&
                            users.map((user, index) => (
                                <div
                                    key={`user-card-${index}-${user.name}`} 
                                >
                                    <Card
                                        className="z-10"
                                        avoidFlip={true}
                                        content={user.name}
                                        flipped={user.flipped}
                                        delay={-(index * 0.25) + ((users.length - 1) * 0.25)}
                                        startPosition={startPosition}
                                        finalPosition={finalPositions[index]}
                                        onCompleteAnimationTimeout={users.length * 500 - (index * 500)}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div ref={shuffledCardsRef as any} className="real-cards flex gap-10 flex-wrap">
                        {state === 'shuffled' &&
                            users.map((user, index) => (
                                <div 
                                    key={`user-card-${index}-${user.name}`} 
                                    className={clsx(`w-[${CARD_SIZE.width}px] h-[${CARD_SIZE.height}px] opacity-0`)}
                                    onClick={() => updateUser({...user, flipped: !user.flipped}, index)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

            
            {/* Send points game Button */}
            {dropState === 'distributed' && 
                <div className='m-10'>
                    <button className='btn btn-primary btn-xl' onClick={sendScores}>
                        Send
                    </button>
                </div>
            }
        </div>
    )
}

export default CardsGame;