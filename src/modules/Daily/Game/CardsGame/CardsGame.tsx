import FlippingCard from '@/components/FlippingCard';
import { getRandomRangeNumber, shuffleItems } from '@/utils/utils';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { Item } from '../../Roulette/Roulette';
import AnimatedCard from './AnimatedCard';

const cards = [...Array(10)];
const pointsPerUser = 10;

const CardsGame = ({ modifier }: { mode: string; modifier: Item['modifier'] }) => {
    const [startPosition, setStartPosition] = useState<{ top: string; left: string }>();
    const [finalPositions, setFinalPositions] = useState<{ top: string; left: string }[]>([]);
    const [users, setUsers] = useState<{name: string; flipped: boolean; }[]>([]);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');
    const deckCardsRef = useRef<HTMLDivElement>(null);
    const shuffledCardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const localUsers = localStorage.getItem('users');
        const usersParsed = localUsers ? JSON.parse(localUsers) : [];

        setUsers(usersParsed);
    }, []);

    const start = () => {
        setDropState('no-dealing');
        setState('shuffling');

        if (deckCardsRef.current) {
            const top = deckCardsRef.current.children[0].getClientRects();
            setStartPosition({ left: `${top[0].left}px`, top: `${top[0].top}px` });
        }

        setTimeout(() => {
            const usersClone = shuffleItems(users);
            setUsers(usersClone);
            setState('shuffled');

            // setTimeout(() => {
            setDropState('dealing');

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
            // }, 500);
        }, ((cards.length - 1) * 250) + 500);
    };

    const sendScores = () => {
        let scores = users.map((_, index) => (index + 1) * pointsPerUser);

        if (modifier?.slug.includes('inverted')) {
            scores = scores.toReversed();
        }

        switch (modifier?.slug) {
            case 'random-points':
                // between 1 and users.length + pointsPerUser -> 4 users (1 - 50)
                scores = scores.map(() => getRandomRangeNumber(1, (users.length * pointsPerUser) + pointsPerUser));
                break;
            case 'random-position-points':
            case 'random-inverted-position-points':
                // between position -+ pointsPerUser -> 4 users (0 - 20, 10 - 30, 20 - 40, 30 - 50)
                scores = scores.map((score) => getRandomRangeNumber(score - pointsPerUser, score + pointsPerUser));
                break;
        }

        const result = users.map((user, index) => ({ ...user, score: scores[index] }));
        console.log(result);

    };

    return (
        <div className='container'>
            <div className='flex flex-row gap-10'>
                <div className='flex gap-10 p-10 justify-between w-full'>
                    <button className='btn btn-primary btn-xl' onClick={start} disabled={state === 'shuffling'}>
                        Shuffle
                        <FaExchangeAlt />
                        {state === 'shuffling' && <span className='loading loading-spinner' />}
                    </button>
                </div>

            </div>
            <div className='flex flex-row gap-x-20 gap-y-30 p-10 flex-wrap'>
                <div ref={deckCardsRef}
                    className={clsx('flex items-center justify-center relative card-item')}
                >
                    {cards.map((_, index) =>
                        <div
                            key={`card-${index}`}
                            className={clsx('absolute card-item', {
                                'animate-card-shuffle': state === 'shuffling'
                            })}
                            style={{
                                left: -(index * 1) + 'px',
                                top: -(index * 1) + 'px',
                                animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                            }}
                            onClick={start}
                        >
                            <AnimatedCard avoidFlip={true} className='z-20' />
                        </div>
                    )}
                </div>
                <div className='flex flex-1'>
                    {state === 'shuffled' && dropState !== 'distributed' &&
                        <div className='absolute-card'>
                            {users.map((user, index) => (
                                <div
                                    key={`user-card-${index}-${user.name}`}
                                >
                                    <AnimatedCard
                                        className='z-10'
                                        avoidFlip={true}
                                        content={user.name}
                                        flipped={user.flipped}
                                        delay={-(index * 0.25) + ((users.length - 1) * 0.25)}
                                        startPosition={startPosition}
                                        finalPosition={finalPositions[index]}
                                        onCompleteAnimationTimeout={users.length * 500 - (index * 500)}
                                    />
                                </div>
                            ))}
                        </div>
                    }
                    <div ref={shuffledCardsRef} className='real-cards flex gap-4 lg:gap-10 flex-wrap justify-center w-full'>
                        {users.length &&
                            users.map((user, index) => (
                                <div
                                    key={`user-card-${index}-${user.name}`}
                                    className={clsx('card-item', {
                                        'opacity-0 pointer-events-none': dropState !== 'distributed'
                                    })}
                                >
                                    <FlippingCard
                                        avoidFlip={true}
                                        flipped={true}
                                        frontContent={
                                            <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-emerald-500 via-emerald-700 to-emerald-800'}>
                                                <h1 className='text-base-content text-2xl 2xl:text-3xl'>{user.name}</h1>
                                            </div>
                                        }
                                        backContent={
                                            <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-purple-500 via-purple-700 to-purple-800'}
                                            />
                                        }
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Send points game Button */}
            <div className='m-10 flex justify-center'>
                <button className='btn btn-primary btn-xl' onClick={sendScores} disabled={dropState !== 'distributed'}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default CardsGame;
