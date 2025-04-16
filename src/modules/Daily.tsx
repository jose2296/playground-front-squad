import { HOCFunctions } from '@/main';
import { Outlet } from 'react-router-dom';

const Daily = ({ nextStep, previousStep }: HOCFunctions) => {
    
    return (
        <>
            <Outlet />
        </>
    );
};
export default Daily;
