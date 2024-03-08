import { useState } from 'react';
import { Links } from './components/Links';
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

    return (
        <div className='flex flex-col h-screen py-8'>
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
        </div>
    );
};
export default Daily;
