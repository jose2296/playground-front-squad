import clsx from 'clsx';
import { FaCog } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';
import ConfigurationModal, { CONFIGURATION_USERS_MODAL_ID } from './modules/Daily/Game/CardsGame/ConfigurationModal';
import { useStore } from './store';
import { handleModalState } from './utils/utils';

const Layout = () => {
    const { steps, currentStep } = useStore();

    return (
        <div className='flex flex-col h-screen'>
            <div className='navbar bg-base-300 shadow-sm'>
                <div className='flex'>
                    <span className='btn btn-ghost text-xl'>Front Squad</span>
                </div>

                <div className='divider divider-horizontal'></div>

                <div className='flex-1 ml-2'>
                    <ul className='flex gap-x-8 px-1'>
                        {steps.length && steps.map((step, index) => (
                            <li key={`step-${index}`} className={'cursor-pointer hover:opacity-70 transition duration-600'}>
                                <NavLink
                                    to={step.route}
                                    viewTransition
                                    // onClick={() => changeStep(step)}
                                >
                                    <span className={clsx('font-bold', {
                                        'text-primary btn-active': currentStep.index === step.index
                                    }) }>{step.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className='mr-4 btn btn-primary btn-md btn-circle' onClick={() => handleModalState(CONFIGURATION_USERS_MODAL_ID, 'showModal')}>
                    <FaCog size={20}/>
                </button>
            </div>
            <Outlet />

            {/* Config modal */}
            <ConfigurationModal />
        </div>
    );



    return (
        <div className='flex flex-col h-screen'>
            <main className='flex-1 flex flex-col pt-8 overflow-auto'>
                <div className='prose max-w-[100%] flex justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-primary border-b-4 border-primary rounded-sm text-4xl w-fit'>{currentStep.name}</h1>
                    </div>
                </div>

                <Outlet />
            </main>

            <div className='w-full h-0.5 bg-primary mb-4' />

            <ul className='steps steps-horizontal flex justify-center p-2'>
                {
                    steps && steps.map((step, index) => (
                        <NavLink
                            key={`step-${index}`}
                            to={step.route}
                            className={({ isActive }) => `
                                step w-[200px]
                                font-bold
                                after:transition-transform after:duration-300
                                before:transition before:duration-300
                                ${isActive ? 'after:scale-125 after:border-[1px] after:border-white' : ''}
                                ${currentStep.index >= step.index ? 'step-primary' : ''}
                            `}
                        >
                            <span className='cursor-pointer hover:scale-110 transition-transform duration-600'>{step.name}</span>
                        </NavLink>
                    ))
                }
            </ul>
        </div>
    );
};
export default Layout;
