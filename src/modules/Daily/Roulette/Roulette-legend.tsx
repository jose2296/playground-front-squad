import { FaInfoCircle } from 'react-icons/fa';
import { events, Item, modifiers } from './Roulette';
import RouletteItem, { ROULETTE_ITEM_SIZE } from './Roulette-item';

const RouletteLegend = ({ gamesData }: { gamesData: Item[] }) => {
    return (
        <div className='overflow-auto w-full'>
            {/* Games */}
            {gamesData?.length &&
                <div className='flex w-full overflow-auto items-center pb-4 px-10 mask-r-from-90% mask-l-from-90%'>
                    {gamesData.map(game => (
                        <div style={{ maxWidth: `${ROULETTE_ITEM_SIZE}px`}} className={'flex flex-col items-center justify-center relative'} key={`${game.slug}-${game.type?.slug}`}>
                            <RouletteItem data={game} />
                        </div>
                    ))}
                </div>
            }
            {/* Modifiers and events*/}
            <div className='flex flex-row items-center justify-center'>
                {!!modifiers.length &&
                    <div className='tooltip flex items-center justify-center gap-2'>
                        <h1 className='text-xl border-primary text-center'>Modifiers</h1>
                        <FaInfoCircle />

                        <div className='tooltip-content'>
                            <div className='flex flex-col gap-1 p-2'>
                                {modifiers.map(modifier => <p key={modifier.name}>{modifier.name}</p>)}
                            </div>
                        </div>
                    </div>
                }
                <div className='divider divider-horizontal'></div>
                {!!events.length &&
                    <div className='tooltip flex items-center justify-center gap-2'>
                        <h1 className='text-xl border-primary text-center'>Events</h1>
                        <FaInfoCircle />

                        <div className='tooltip-content'>
                            <div className='flex flex-col gap-1 p-2'>
                                {events.map(modifier => <p key={modifier.name}>{modifier.name}</p>)}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default RouletteLegend;
