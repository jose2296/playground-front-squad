import { FaInfoCircle } from "react-icons/fa";
import RouletteItem, { ITEM_WIDTH } from "./Roulette-item";
import rouletteData from '@/data/roulette.json';
import { Item } from "./Roulette";

const RouletteLegend = ({ gamesData }: { gamesData: Item[] }) => {
    return (
        <div>
            {/* Games */}
            {gamesData?.length && 
                <div className='flex flex-row flex-wrap items-center justify-center'>
                    {gamesData.map(game => (
                        <div style={{ maxWidth: `${ITEM_WIDTH}px`}} className={`flex flex-col items-center justify-center relative`} key={`${game.slug}-${game.type?.slug}`}>
                            <RouletteItem data={game} />
                            <div style={{ maxWidth: `${ITEM_WIDTH}px`}} className="flex items-center gap-2 p-2 absolute -top-1 -right-1 z-10">
                                {/* <p className={`truncate`}>{'game.description game.description game.description game.description game.description'}</p> */}
                                <div className="w-full tooltip cursor-pointer">
                                    <FaInfoCircle />
                                    <div className="tooltip-content">
                                        <p>{'game.description game.description game.description game.description game.description'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {/* Modifiers */}
            <div className="flex flex-col items-center justify-center">
                <h1 className='text-xl border-b-4 rounded-br-md px-6 mt-10 mb-4 rounded-bl-md border-primary text-center'>Modifiers</h1>
                <div className="flex flex-row items-center justify-center flex-wrap">
                    {rouletteData.modifiers.filter(modifier => modifier.active).map((modifier, index) => (
                        <div className={`flex items-center`} key={`${modifier.slug}`}>
                            {modifier.name}
                            {index !== rouletteData.modifiers.filter(modifier => modifier.active).length - 1 &&
                                <div className='mx-4 h-6 w-0.5 inline-block bg-white' />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div> 
    );
};

export default RouletteLegend;