import clsx from 'clsx';
import { Item } from './Roulette';

export const ROULETTE_ITEM_SIZE = 180;
export const ROULETTE_ITEM_MARGIN = 10;
const ROULETTE_ITEM_INNER_SIZE = ROULETTE_ITEM_SIZE - (ROULETTE_ITEM_MARGIN * 2);

const itemClassName = 'flex flex-col shrink-0 rounded-lg relative overflow-hidden py-4';
const style = {
    width: `${ROULETTE_ITEM_INNER_SIZE}px`,
    height: `${ROULETTE_ITEM_INNER_SIZE}px`,
    margin: `${ROULETTE_ITEM_MARGIN}px`
};
const types: { [key: string]: string } = {
    balls: 'from-purple-500 via-purple-700 to-purple-800',
    cards: 'from-emerald-500 via-emerald-700 to-emerald-800',
    empty: 'bg-transparent'
};

const RouletteItem = ({ data, winningItem, className }: { data: Item, winningItem?: Item; className?: string }) => {

    if (data.slug === 'empty') {
        return (
            <div
                style={style}
                className={itemClassName}
            />
        );
    }

    return (
        <div
            style={style}
            className={clsx(itemClassName, {
                'item-border-animated-wrapper': (!!data.event && winningItem?.index === data.index)
            })}
        >
            <div className={`${className} item-border-animated-content flex flex-col shrink-0 rounded-lg px-2 justify-center items-center bg-gradient-to-t ${types[data.type?.slug || 'empty']}`}>
                {/* <img src={data.typeImage} alt={data.name} className="w-10 h-12 object-cover" /> */}
                <span className='flex flex-1 items-center justify-center text-center'>{data.type?.name}</span>
                <div className='bg-slate-100 w-4/5 h-[1px] my-2'></div>
                <span className='flex flex-1 items-center justify-center text-center font-bold'>{data.name}</span>
                {/* {data.modifier?.name} */}
            </div>
        </div>
    );
};

export default RouletteItem;
