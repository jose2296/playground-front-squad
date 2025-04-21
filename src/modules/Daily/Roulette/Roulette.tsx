import rouletteData from '@/data/roulette.json';
import { useRouletteStore } from '@/store';
import { getRandomOptionByNumberKey, shuffleItems } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RouletteItem, { ITEM_WIDTH } from './Roulette-item';
import RouletteLegend from './Roulette-legend';

const ANIMATION_TIME = 5;

export interface Item {
    index?: number;
    translateXOffset?: number;
    name: string;
    slug: string;
    type?: typeof rouletteData['games'][number];
    typeImage?: string;
    modifier?: typeof rouletteData['modifiers'][number];
    event?: typeof rouletteData['events'][number];
};

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

const DailyRoulette = () => {    
    const [isSpinning, setIsSpinning] = useState(false);
    const { selectedItem, setSelectedItem } = useRouletteStore();
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
        if (isSpinning && selectedItem) {
            if (rouletteRef.current) {
                // - (position of winning item) + (offset of empty items) -+ (random offset of third of item width)
                rouletteRef.current.style.transition = `transform ${ANIMATION_TIME}s cubic-bezier(0.23, 1, 0.320, 1)`;
                rouletteRef.current.style.transform = `translateX(${selectedItem.translateXOffset}px)`;
            }

            setTimeout(() => {
                setIsSpinning(false);
                (document.getElementById('winningItemModal') as HTMLDialogElement)?.showModal();

            }, ANIMATION_TIME * 1000);
        }
    }, [selectedItem]);

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
        setShowLegend(false)
    };

    // Function that shuffle items in random order
    const setShuffleItems = () => {
        const repetitions = Math.ceil(50 / gamesData.length);
        const itemsShuffled = shuffleItems<Item>(
            Array.from({ length: repetitions }, () => shuffleItems(gamesData)).flat()
        );
        const modifiers = rouletteData.modifiers.filter(modifier => modifier.active);
        const eventIndex = Math.floor(Math.random() * rouletteData.events.length);
        const newItems = itemsShuffled.map((item, index) => ({
            ...item,
            index,
            modifier: item.type?.modifiersActivated ? getRandomOptionByNumberKey(modifiers, 'weight') : undefined,
            event: Math.random() > 0.8 ? rouletteData.events[eventIndex] : undefined
        }));
        
        setItems(newItems);
        // setItems([{ name: 'empty', slug: 'empty', index: -1 }, { name: 'empty', slug: 'empty', index: -1 }, ...newItems]);
    };

    const calculateWinningItem = () => {
        const randomIndex = items.length - 3 - Math.floor(Math.random() * 13);
        const winningItem: Item = {
            ...items[randomIndex],
            translateXOffset: -(randomIndex * ITEM_WIDTH) + (ITEM_WIDTH * 2) - (Math.floor(Math.random() * ITEM_WIDTH / 3) * (Math.random() > 0.5 ? -1 : 1)),
        };

        setSelectedItem(winningItem);
    };

    return (
        <div className="flex flex-col items-center p-4 h-full justify-center">

            {/* Legend */}
            {showLegend && <RouletteLegend gamesData={gamesData} />}

            {/* Roulette */}
            {!!items.length &&
                <div className="relative w-[800px] h-[180px] overflow-hidden rounded-lg mask-r-from-90% mask-l-from-90%">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-200 z-10 -translate-x-1/2" />
                    <div ref={rouletteRef} className="flex top-2 absolute will-change-transform" style={{ transform: 'translateX(0)' }}>
                        {items.map((item, index) => (
                            <RouletteItem key={`${item.slug}-${index}`} data={item} winningItem={selectedItem as Item} />
                        ))}
                    </div>
                </div>
            }

            {/* Start/go to game Button */}
            <div className='m-10'>
                {(!selectedItem || isSpinning) &&
                    <button className='btn btn-primary btn-xl' onClick={spinRoulette} disabled={isSpinning}>
                        Start
                        {isSpinning && <span className="loading loading-spinner"></span>}
                    </button>
                }
                {!isSpinning && selectedItem && 
                    <Link to={`/daily/${selectedItem?.slug}`} className='btn btn-primary btn-xl'>Go to game</Link>
                }
            </div>

            {/* Result modal */}
            <dialog id='winningItemModal' className="modal">
                <div className="modal-box">
                    <div className='flex flex-col items-center justify-center'>
                        {selectedItem && 
                            <>
                                <RouletteItem data={selectedItem} winningItem={selectedItem}/>
                                {selectedItem?.modifier && 
                                        <p>Modificador: <span className='font-bold'>{selectedItem?.modifier?.name}</span></p>   
                                }
                                {selectedItem?.event && 
                                    <p>Event: <span className='font-bold'>{selectedItem?.event?.name}</span></p>  
                                } 
                            </>
                        }                
                    </div>
                    <div className="modal-action justify-center">
                        <form method="dialog">
                            <Link to={`/daily/${selectedItem?.slug}`} className='btn btn-primary'>Go to game</Link>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

export default DailyRoulette;