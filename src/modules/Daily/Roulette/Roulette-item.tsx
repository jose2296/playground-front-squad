import clsx from 'clsx';
import { Item } from './Roulette';

export const ITEM_WIDTH = 160;
const margin = 10;
const innerItemWidth = ITEM_WIDTH - (margin * 2);

const itemClassName = 'flex flex-col shrink-0 rounded-lg relative overflow-hidden py-4';
const style = {
    width: `${innerItemWidth}px`,
    height: `${innerItemWidth}px`,
    margin: `${margin}px`
};
const types: { [key: string]: string } = {
    balls: 'from-purple-500 via-purple-700 to-purple-800',
    cards: 'from-emerald-500 via-emerald-700 to-emerald-800',
    empty: 'bg-transparent'
};

const RouletteItem = ({ data, winningItem }: { data: Item, winningItem?: Item }) => {

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
            className={clsx(itemClassName, { 'card-wrapper': (!!data.event && winningItem?.index === data.index) })}
        >
            <div className={`card-content flex flex-col shrink-0 rounded-lg px-2 justify-center items-center bg-gradient-to-t ${types[data.type?.slug || 'empty']}`}>
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
