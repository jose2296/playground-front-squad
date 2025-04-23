import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from './store';

const Layout = () => {
    const { steps, currentStep } = useStore();

    // const navigate = useNavigate();

    // useEffect(() => {
    //     navigate(currentStep.route);
    // }, [currentStep]);

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
