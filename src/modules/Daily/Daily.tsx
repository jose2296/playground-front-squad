import { HOCFunctions } from '@/main';
import { Outlet } from 'react-router-dom';
import DailyScores from './DailyScores';

const Daily = ({ previousStep, nextStep }: HOCFunctions) => {

    return (
        <div className='flex flex-row flex-1 w-full'>
            <div className='flex w-3/4 justify-center p-6'>
                <Outlet context={{ previousStep, nextStep }} />
            </div>
            <div className='flex w-1/4 min-w-[280px] border-l-neutral-50/20 border-l-2 items-start pt-6'>
                <DailyScores />
            </div>
        </div>
    );
};

export default Daily;
