import ConfigurationModal from '@/modules/components/configuration-modal';
import { shuffleItems } from '@/utils/utils';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { FaCog, FaExchangeAlt } from 'react-icons/fa';
import { Item } from '../../Roulette/Roulette';
import Card, { CARD_SIZE } from './Card';
import './CardsGame.sass';

const cards = [...Array(10)];

const CardsGame = ({ mode, modifier }: { mode: string; modifier: Item['modifier'] }) => {
    const [startPosition, setStartPosition] = useState<{ top: string; left: string }>();
    const [finalPositions, setFinalPositions] = useState<{ top: string; left: string }[]>([]);
    const [users, setUsers] = useState<{name: string; flipped: boolean; }[]>([]);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');
    const deckCardsRef = useRef<HTMLDivElement>();
    const shuffledCardsRef = useRef<HTMLDivElement>();

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

            setTimeout(() => {
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
            }, 500);
        }, ((cards.length - 1) * 250) + 500);
    };

    const sendScores = () => {
        let scores = users.map((_, index) => (index + 1) * 10);

        if (modifier?.slug.includes('inverted')) {
            scores = scores.toReversed();
        }

        switch (modifier?.slug) {
            case 'random-points':
                scores = scores.toReversed();
                break;
            case 'random-position-points':
                scores = scores.toReversed();

                break;
            case 'random-inverted-position-points':
                scores = scores.toReversed();

                break;
        }

        console.log(users.map((user, index) => ({ ...user, score: scores[index] })));
    };

    const handleModalState = (state: 'showModal' | 'close') => {
        (document.getElementById('usersModal') as HTMLDialogElement)[state]();
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
                    <button className='btn btn-secondary btn-lg btn-circle' onClick={() => handleModalState('showModal')}>
                        <FaCog />
                    </button>
                </div>

            </div>
            <div className='flex flex-row gap-x-10 gap-y-20 p-10 flex-wrap'>
                <div ref={deckCardsRef as any}
                    className={clsx('flex items-center justify-center relative')}
                    style={{
                        width: `${CARD_SIZE.width}px`,
                        height: `${CARD_SIZE.height}px`
                    }}
                >
                    {cards.map((_, index) =>
                        <div
                            key={`card-${index}`}
                            className={clsx('absolute', {
                                'animate-shuffle': state === 'shuffling'
                            })}
                            style={{
                                width: `${CARD_SIZE.width}px`,
                                height: `${CARD_SIZE.height}px`,
                                left: -(index * 1) + 'px',
                                top: -(index * 1) + 'px',
                                animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                            }}
                            onClick={start}
                        >
                            <Card avoidFlip={true} className='z-20' />
                        </div>
                    )}
                </div>
                <div>
                    <div className='absolute-card flex gap-10 flex-wrap'>
                        {state === 'shuffled' &&
                            users.map((user, index) => (
                                <div
                                    key={`user-card-${index}-${user.name}`}
                                >
                                    <Card
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
                            ))
                        }
                    </div>
                    <div ref={shuffledCardsRef as any} className='real-cards flex gap-10 flex-wrap'>
                        {users.length &&
                            users.map((user, index) => (
                                <div
                                    key={`user-card-${index}-${user.name}`}
                                    className={clsx('opacity-0')}
                                    style={{
                                        width: `${CARD_SIZE.width}px`,
                                        height: `${CARD_SIZE.height}px`
                                    }}
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

            {/* Config modal */}
            <ConfigurationModal handleModalState={handleModalState} updateUsers={(newUsers) => setUsers(newUsers)}/>
        </div>
    );
};

export default CardsGame;
