import { Item } from "./Roulette";

export const ITEM_WIDTH = 160;
const margin = 10;
const innerItemWidth = ITEM_WIDTH - margin;

const itemClassName = `flex flex-col flex-shrink-0 w-[${innerItemWidth}px] h-[${innerItemWidth}px] m-[${margin}px] rounded-lg relative overflow-hidden px-2 py-4 flex justify-center items-center`;
const types: { [key: string]: string } = {
    balls: 'bg-red-500',
    cards: 'bg-blue-500',
    empty: 'bg-transparent'
}
const RouletteItem = ({ data }: { data: Item }) => {

    if (data.slug === 'empty') {
        return (
            <div className={itemClassName} />
        );
    }

    return (
        <div className={`${itemClassName} ${types[data.type?.slug || 'empty']}`}>
            {/* <img src={data.typeImage} alt={data.name} className="w-10 h-12 object-cover" /> */}
            <span className='flex flex-1 items-center justify-center text-center text-primary-content'>{data.type?.name}</span>
            <div className="bg-slate-100 w-4/5 h-[1px] my-2"></div>
            <span className='flex flex-1 items-center justify-center text-center text-primary-content font-bold'>{data.name}</span>
            {/* {data.modifier?.name} */}
        </div>
    );
};

export default RouletteItem;