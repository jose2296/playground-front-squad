
import rouletteData from '@/data/roulette.json';
import { useEffect, useRef, useState } from 'react';
import RouletteItem, { ITEM_WIDTH } from './Roulette-item';
import { getRandomOptionByNumberKey, shuffleItems } from '@/utils/utils';
import { Link, useOutletContext } from 'react-router-dom';
import { HOCFunctions } from '@/main';
import { useRouletteStore } from '@/store';
import { FaInfoCircle } from "react-icons/fa";

const ANIMATION_TIME = 5;

export interface Item {
    translateXOffset?: number;
    name: string;
    slug: string;
    type?: typeof rouletteData['games'][number];
    typeImage?: string;
    modifier?: typeof rouletteData['modifiers'][number];
}
const IMAGES: { [key: string]: string } = {
    balls: '/balls-game.png',
    cards: '/cards-game.png'
}
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

// TODO: Usar zustand para manejar el item guardardo y manejar los steps de la daily para saber en que paso estoy
const Roulette = () => {    
    const [isSpinning, setIsSpinning] = useState(false);
    // const [winningItem, setWinningItem] = useState<Item | null>(null);
    const { item, setItem } = useRouletteStore();
    const [items, setItems] = useState<Item[]>([]);
    const rouletteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = 'translateX(0)';
        }
    }, []);

    useEffect(() => {
        if (isSpinning && item) {
            if (rouletteRef.current) {
                // - (position of winning item) + (offset of empty items) -+ (random offset of third of item width)
                rouletteRef.current.style.transition = `transform ${ANIMATION_TIME}s cubic-bezier(0.23, 1, 0.320, 1)`;
                rouletteRef.current.style.transform = `translateX(${item.translateXOffset}px)`;
            }

            setTimeout(() => {
                setIsSpinning(false);
                (document.getElementById('winningItemModal') as HTMLDialogElement)?.showModal();

            }, ANIMATION_TIME * 1000);
        }
    }, [item]);

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
    };

    // Function that shuffle items in random order
    const setShuffleItems = () => {
        const repetitions = Math.ceil(50 / gamesData.length);
        const itemsShuffled = shuffleItems<Item>(
            Array.from({ length: repetitions }, () => shuffleItems(gamesData)).flat()
        );
        const modifiers = rouletteData.modifiers.filter(modifier => modifier.active);
        const newItems = itemsShuffled.map(item => ({
            ...item,
            modifier: item.type?.modifiersActivated ? getRandomOptionByNumberKey(modifiers, 'weight') : undefined,
        }));
        console.log(newItems);
        
        setItems([{ name: 'empty', slug: 'empty' }, { name: 'empty', slug: 'empty' }, ...newItems]);
    };

    const calculateWinningItem = () => {
        const randomIndex = items.length - 3 - Math.floor(Math.random() * 13);
        const winningItem: Item = {
            ...items[randomIndex],
            translateXOffset: -(randomIndex * ITEM_WIDTH) + (ITEM_WIDTH * 2) - (Math.floor(Math.random() * ITEM_WIDTH / 3) * (Math.random() > 0.5 ? -1 : 1))

        };
        console.log(winningItem);

        setItem(winningItem);
    };
    return (
        <div className="flex flex-col items-center p-4 h-full justify-center">
            {gamesData?.length && 
                <div className='flex flex-row'>
                    {gamesData.map(game => (
                        <div style={{ maxWidth: `${ITEM_WIDTH}px`}} className={`flex flex-col items-center justify-center`} key={`${game.slug}-${game.type?.slug}`}>
                            <RouletteItem data={game} />
                            <div style={{ maxWidth: `${ITEM_WIDTH}px`}} className="flex items-center gap-2 p-2">
                                <p className={`truncate`}>{'game.description game.description game.description game.description game.description'}</p>
                                <div className="w-full tooltip">
                                    <FaInfoCircle />
                                    <div className="tooltip-content">
                                        <div className="">
                                            {'game.description game.description game.description game.description game.description'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {!!items.length &&
                <div className="relative w-[800px] h-[180px] overflow-hidden bg-slate-800 border-2 rounded-lg border-slate-100">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-200 z-10 -translate-x-1/2" />
                    <div ref={rouletteRef} className="flex top-2 absolute will-change-transform" style={{ transform: 'translateX(0)' }}>
                        {items.map((item, index) => (
                            <RouletteItem key={`${item.slug}-${index}`} data={item} />
                        ))}
                    </div>
                </div>
            }
            <div className='m-10'>
                <button className='btn btn-primary' onClick={spinRoulette} disabled={isSpinning}>
                    Start
                    {isSpinning && <span className="loading loading-spinner"></span>}
                </button>
            </div>

            <dialog id='winningItemModal' className="modal">
                <div className="modal-box">
                    <div className='flex flex-col items-center justify-center'>
                        {item && 
                            <>
                                <RouletteItem data={item} />
                                {item?.modifier && 
                                    <p>Modifier: <span className='font-bold'>{item?.modifier?.name}</span></p>   
                                } 
                            </>
                        }                
                    </div>
                    <div className="modal-action justify-center">
                        <form method="dialog">
                            <Link to={`/daily/${item?.slug}`} className='btn btn-primary'>Go to game</Link>
                        </form>
                    </div>
                </div>
                {/* <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form> */}
            </dialog>
        </div>
    );
}

export default Roulette;