import rouletteData from '@/data/roulette.json';
import { useRouletteStore } from '@/store';
import { getRandomOptionByNumberKey, handleModalState, shuffleItems } from '@/utils/utils';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RouletteItem, { ROULETTE_ITEM_MARGIN, ROULETTE_ITEM_SIZE } from './Roulette-item';
import RouletteLegend from './Roulette-legend';

const ANIMATION_TIME = 5;
const WINNING_ITEM_MODAL_ID = 'winning_item_mModal';
const MANUAL_ROULETTE_ITEM_SELECTION_MODAL_ID = 'manual_roulette_item_selection_modal';

export interface Item {
    index?: number;
    translateXOffset?: number;
    name: string;
    slug: string;
    description?: string;
    type?: typeof rouletteData['games'][number];
    typeImage?: string;
    modifier?: typeof rouletteData['modifiers'][number];
    event?: typeof rouletteData['events'][number];
}

const IMAGES: { [key: string]: string } = {
    balls: '/balls-game.png',
    cards: '/cards-game.png'
};

const gamesData = rouletteData.games.reduce<Item[]>((acc, game) => {
    return [
        ...acc,
        ...game.modes.reduce<Item[]>((gamesAcc, mode) => {
            if (mode.active) {
                return [
                    ...gamesAcc,
                    {
                        ...mode,
                        type: game,
                        typeImage: IMAGES[game.slug]
                    }
                ];
            }

            return gamesAcc;
        }, [])
    ];
}, []);
export const modifiers = rouletteData.modifiers.filter(modifier => modifier.active);
export const events = rouletteData.events.filter(event => event.active);

const DailyRoulette = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const { setSelectedItem } = useRouletteStore();
    const [winningItem, setWinningItem] = useState<Item>();
    const [manualItem, setManualItem] = useState<Item>({...gamesData[0], modifier: modifiers[0] });
    const [items, setItems] = useState<Item[]>([]);
    const [showLegend, setShowLegend] = useState(true);
    const rouletteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = 'translateX(0)';
        }

    }, []);

    useEffect(() => {
        if (isSpinning && winningItem) {
            if (rouletteRef.current) {
                // - (position of winning item) + (offset of empty items) -+ (random offset of third of item width)
                rouletteRef.current.style.transition = `transform ${ANIMATION_TIME}s cubic-bezier(0.23, 1, 0.320, 1)`;
                rouletteRef.current.style.transform = `translateX(${winningItem.translateXOffset}px)`;
            }

            setTimeout(() => {
                setIsSpinning(false);
                handleModalState(WINNING_ITEM_MODAL_ID, 'showModal');
            }, ANIMATION_TIME * 1000);
        }
    }, [winningItem]);

    useEffect(() => {
        if (items.length) {
            setTimeout(() => {
                calculateWinningItem();
            }, 500);
        }
    }, [items]);

    const spinRoulette = () => {
        if (isSpinning) return;

        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = 'translateX(0)';
        }

        setShuffleItems();
        setIsSpinning(true);
        setShowLegend(false);
    };

    // Function that shuffle items in random order
    const setShuffleItems = () => {
        const repetitions = Math.ceil(50 / gamesData.length);
        const itemsShuffled = shuffleItems<Item>(
            Array.from({ length: repetitions }, () => shuffleItems(gamesData)).flat()
        );
        const eventIndex = Math.floor(Math.random() * events.length);
        const newItems = itemsShuffled.map((item, index) => ({
            ...item,
            index,
            modifier: item.type?.modifiersActivated ? getRandomOptionByNumberKey(modifiers, 'weight') : undefined,
            event: Math.random() > 0.8 ? events[eventIndex] : undefined
        }));

        setItems(newItems);
        // setItems([{ name: 'empty', slug: 'empty', index: -1 }, { name: 'empty', slug: 'empty', index: -1 }, ...newItems]);
    };

    const calculateWinningItem = () => {
        const randomIndex = items.length - 3 - Math.floor(Math.random() * 13);
        const winningItem: Item = {
            ...items[randomIndex],
            translateXOffset: -(randomIndex * ROULETTE_ITEM_SIZE) + (ROULETTE_ITEM_SIZE * 2) - (Math.floor(Math.random() * ROULETTE_ITEM_SIZE / 3) * (Math.random() > 0.5 ? -1 : 1)),
        };

        setWinningItem(winningItem);
    };

    return (
        <div className='flex flex-col w-full items-center p-4 h-full justify-center'>

            {/* Legend */}
            {showLegend && <RouletteLegend gamesData={gamesData} />}

            {/* Roulette */}
            {!!items.length &&
                <div style={{ height: ROULETTE_ITEM_SIZE }} className='relative w-[800px] overflow-hidden rounded-lg mask-r-from-90% mask-l-from-90%'>
                    <div style={{ height: ROULETTE_ITEM_SIZE - ROULETTE_ITEM_MARGIN}} className='absolute left-1/2 top-1/2 bottom-1/2 w-0.5 bg-yellow-300 z-10 -translate-x-1/2 -translate-y-1/2' />
                    <div ref={rouletteRef} className='flex absolute will-change-transform' style={{ transform: 'translateX(0)' }}>
                        {items.map((item, index) => (
                            <RouletteItem key={`${item.slug}-${index}`} data={item} winningItem={winningItem as Item} />
                        ))}
                    </div>
                </div>
            }

            {/* Start/go to game Button */}
            <div className='m-10 flex flex-col gap-y-4 items-center'>
                {(!winningItem || isSpinning) &&
                        <button className='btn btn-primary btn-lg w-50' onClick={spinRoulette} disabled={isSpinning}>
                            Start roulette
                            {isSpinning && <span className='loading loading-spinner'></span>}
                        </button>
                }
                {!isSpinning && winningItem &&
                        <Link to={`/daily/${winningItem?.slug}`} onClick={() => setSelectedItem(winningItem)} className='btn btn-primary btn-lg w-50'>Go to game</Link>
                }
                {!isSpinning && !winningItem &&
                    <button className='btn btn-accent btn-lg w-50' onClick={() => handleModalState(MANUAL_ROULETTE_ITEM_SELECTION_MODAL_ID, 'showModal')} disabled={isSpinning}>
                        Manual
                    </button>
                }
            </div>

            {/* Manual roulette item selection modal */}
            <dialog id={MANUAL_ROULETTE_ITEM_SELECTION_MODAL_ID} className='modal'>
                <div className='modal-box overflow-auto flex flex-col items-center min-w-3xl'>
                    <div className='flex flex-col w-full items-center'>
                        <p className='text-xl border-b-2 w-fit mt-2 px-2'>Modes:</p>
                        <div className='flex w-full overflow-auto p-4'>
                            {gamesData.map((item, index) => (
                                <div
                                    key={`${item.slug}-${index}`}
                                    className={clsx('flex items-center justify-center transition', {
                                        'scale-105': item.slug === manualItem?.slug && item.type?.slug === manualItem.type?.slug
                                    })}
                                    onClick={() => setManualItem(item)}
                                >
                                    <RouletteItem data={item} className={item.slug === manualItem?.slug && item.type?.slug === manualItem.type?.slug ? 'border-4 border-info' : ''} />
                                </div>
                            ))}
                        </div>

                        {!!modifiers.length &&
                            <>
                                <p className='text-xl border-b-2 w-fit mt-2 px-2'>Modifiers:</p>
                                <div className='grid grid-cols-2 py-6 gap-x-6 gap-y-4 justify-center'>
                                    {modifiers.map(item => (
                                        <label key={item.name} className='flex items-center gap-2'>
                                            <input type='radio' name='radio-4' onChange={() => setManualItem({ ...manualItem as Item, modifier: item })} className='radio radio-primary' checked={manualItem.modifier?.slug == item.slug} />
                                            <span>{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </>
                        }

                        {!!events.length &&
                            <>
                                <p className='text-xl border-b-2 w-fit mt-2 px-2'>Events:</p>
                                <div className='grid grid-cols-3 py-6 gap-x-6 gap-y-4 justify-center'>
                                    {events.map(item => (
                                        <label key={item.name} className='flex items-center gap-2'>
                                            <input type='radio' name='radio-4' onChange={() => setManualItem({ ...manualItem as Item, event: item })} className='radio radio-primary' checked={manualItem.event?.slug == item.slug} />
                                            <span>{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </>
                        }

                        <div className='modal-action justify-center'>
                            <form method='dialog' >
                                <Link
                                    to={`/daily/${manualItem?.slug}`}
                                    className={'btn btn-primary btn-lg'}
                                    onClick={() => setSelectedItem(manualItem as Item)}
                                >
                                    Go to game
                                </Link>
                            </form>
                        </div>

                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button>close</button>
                </form>
            </dialog>

            {/* Result modal */}
            <dialog id={WINNING_ITEM_MODAL_ID} className='modal'>
                <div className='modal-box'>
                    <div className='flex flex-col items-center justify-center'>
                        {winningItem &&
                            <>
                                <RouletteItem data={winningItem} winningItem={winningItem} />
                                {winningItem?.modifier &&
                                        <p>Modificador: <span className='font-bold'>{winningItem?.modifier?.name}</span></p>
                                }
                                {winningItem?.event &&
                                    <p>Event: <span className='font-bold'>{winningItem?.event?.name}</span></p>
                                }
                            </>
                        }
                    </div>
                    <div className='modal-action justify-center'>
                        <form method='dialog'>
                            <Link to={`/daily/${winningItem?.slug}`} onClick={() => setSelectedItem(winningItem as Item)} className='btn btn-primary'>Go to game</Link>
                        </form>
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default DailyRoulette;
