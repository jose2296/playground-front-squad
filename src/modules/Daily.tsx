import { useEffect, useState } from 'react';
import themes from '../themes';
import { Links } from './components/Links';
import ConfigurationModal from './components/configuration-modal';
import DailyCards from './components/daily-cards';

const steps = [
    {
        index: 0,
        name: 'Games'
    },
    {
        index: 1,
        name: 'Daily'
    },
    {
        index: 2,
        name: 'Issues'
    },
    {
        index: 3,
        name: 'Defectos'
    },
    {
        index: 4,
        name: 'Nuevos desarrollos'
    },
    {
        index: 5,
        name: 'Dudas'
    },
];


const Daily = () => {
    const [currentStep, setCurrentStep] = useState(steps[0]);
    const [theme, setTheme] = useState(themes[0]);

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);

    const nextStep = () => {
        const nextIndex = currentStep.index + 1;
        if (nextIndex <= steps[steps.length - 1].index) {
            setCurrentStep(steps[currentStep.index + 1]);
        }
    };

    // const backStep = () => {
    //     const previousIndex = currentStep.index - 1;
    //     if (previousIndex !== -1) {
    //         setCurrentStep(steps[currentStep.index - 1]);
    //     }
    // };

    const handleModalState = (state: 'showModal' | 'close') => {
        (document.getElementById('usersModal') as HTMLDialogElement)[state]();
    };

    const handleConfigurationModalState = (state: 'showModal' | 'close') => {
        handleModalState(state);
    };

    return (
        <div className='flex flex-col h-screen py-8'>
            {/* <button className='btn btn-circle btn-outline absolute right-0' onClick={() => handleModalState('showModal')}>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' />
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                </svg>
            </button> */}
            <select onChange={(e) => setTheme(e.target.value)}>
                {themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
            </select>
            <main className='flex-1 flex flex-col'>
                <div className='prose max-w-[100%] flex justify-center'>
                    <h1 className='text-primary border-b-4 border-primary rounded'>{currentStep.name}</h1>
                </div>

                {currentStep.name === 'Games' && <Links handleNext={nextStep} />}

                {currentStep.name === 'Daily' && <DailyCards />}


                {currentStep.name === 'Issues' && <div className='issues'>
                    <a className='anchor-link' href='https://ezzingsolar.atlassian.net/jira/dashboards/10011' target='_blank' rel='noreferrer'>Jira Issues dashboard</a>
                </div>}

                {currentStep.name === 'Defectos' && <div className='defectos'>
                    <p className='anchor-link'>Defectos</p>
                </div>}

                {currentStep.name === 'Nuevos desarrollos' && <div className='defectos'>
                    <p className='anchor-link'>Nuevos desarrollos</p>
                </div>}

                {currentStep.name === 'Dudas' && <div className='defectos'>
                    <p className='anchor-link'>Dudas</p>
                </div>}
            </main>

            <div className='divider divider-primary' />

            <ul className='steps steps-horizontal flex justify-center'>
                {
                    steps && steps.map((step, index) => (
                        <li
                            key={`step-${index}`}
                            className={`
                                step w-[200px]
                                font-bold
                                ${currentStep.index >= step.index ? 'step-primary' : ''}
                            `}
                        >
                            <span className='cursor-pointer hover:scale-110 transition-transform duration-400' onClick={() => setCurrentStep(step)}>{step.name}</span>
                        </li>
                    ))
                }
            </ul>

            <ConfigurationModal handleModalState={handleConfigurationModalState} />
        </div>
    );
};
export default Daily;
