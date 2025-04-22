import { HOCFunctions } from '@/main';
import { Outlet } from 'react-router-dom';
import DailyScores from './DailyScores';

const Daily = ({ previousStep, nextStep }: HOCFunctions) => {

    return (
        <div className='flex flex-row flex-1 w-full'>
            <div className='flex w-3/4 justify-center'>
                <Outlet context={{ previousStep, nextStep }} />
            </div>
            <div className='flex w-1/4 min-w-[150px] border-l-2 items-start'>
                <DailyScores />
            </div>
        </div>
    );
};

export default Daily;
