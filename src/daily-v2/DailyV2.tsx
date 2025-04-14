import { Fragment, useEffect, useState } from 'react';
import './DailyV2.sass';
import { Links } from './components/Links';
import Game from '../Game/Game';

interface Link {
    name: string;
    url: string;
    icon: string;
}

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
]

const DailyV2 = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');
    const [currentStep, setCurrentStep] = useState(steps[0]);

    const [configUsers, setConfigUsers] = useState(false);
    const [usersForm, setUsersForm] = useState<string[]>([]);

    const cards = [...Array(10)];

    useEffect(() => {
        const localUsers = localStorage.getItem('users');
        const usersParsed = localUsers ? JSON.parse(localUsers) : [];

        setUsers(usersParsed);
        setUsersForm(usersParsed);
    }, []);

    const start = () => {
        setDropState('no-dealing')
        setState('shuffling');
        setTimeout(() => {
            const usersClone = [...users].sort(() => Math.random() - 0.5);
            setUsers(usersClone);
            setState('shuffled');

            setTimeout(() => {
                setDropState('dealing')
                setTimeout(() => {
                    setDropState('distributed');
                }, 1500);
            }, 500)
        }, ((cards.length - 1) * 250) + 500);
    };

    const openConfig = () => {
        setConfigUsers(!configUsers);
    };

    const updateUser = (newUserValue: string, index: number) => {
        const _userForm = [...usersForm];
        _userForm[index] = newUserValue;
        setUsersForm([..._userForm]);
    };

    const removeUser = (index: number) => {
        const _users = [...usersForm];
        _users.splice(index, 1);
        setUsersForm([..._users]);
    };

    const saveUsers = () => {
        setState('ready');
        setConfigUsers(false);
        setUsersForm([...usersForm]);
        setUsers([...usersForm]);

        localStorage.setItem('users', JSON.stringify(usersForm));
    };

    const addNewUser = () => {
        setUsersForm([...usersForm, ''])
    };

    const handleClickLink = (url: string) => {
        window.open(url, '_blank');
    };


    const nextStep = () => {
        const nextIndex = currentStep.index + 1;
        if (nextIndex <= steps[steps.length - 1].index) {
            setCurrentStep(steps[currentStep.index + 1])
        }
    };

    const backStep = () => {
        const previousIndex = currentStep.index - 1;
        if (previousIndex !== -1) {
            setCurrentStep(steps[currentStep.index - 1])
        }
    };

    return (
        <div className="container">
            <div className="wrapper">
                <div className="stepper-container">
                    <h1>Steps</h1>
                    <div className="steps">
                        {!!steps.length && steps.map((step, index) => (
                            <Fragment key={`step-${index}`}>
                                <div className={`step ${currentStep.index > step.index ? 'done' : ''} ${currentStep.index === step.index ? 'active' : ''}`} key={`step-${index}`}>
                                    <div className="icon">{index + 1}</div>
                                    <div className="text">{step.name}</div>
                                </div>
                                {(index < steps.length - 1) && <div className="line"></div>}
                            </Fragment>
                        ))}

                        <div className="step-buttons">
                            <button className="button" onClick={backStep}>
                                <span>Back</span>
                            </button>
                            <button className="button" onClick={nextStep}>
                                <span>Next</span>
                            </button>
                        </div>

                    </div>
                </div>

                <div className="main">
                    <div className="title">
                        <span>{currentStep.name}</span>
                    </div>
                    {currentStep.name === 'Daily' && <div className="daily-game ">
                        <Game />
                    </div>
                    }

                    {/* TODO: ALL DAILY CARD */}
                    {
                    // currentStep.name === 'Daily' && <div className="daily">

                    //     <div className="buttons">
                    //         <button className="button" onClick={start}>
                    //             <span>Shuffle</span>
                    //         </button>
                    //         <button className="button" onClick={openConfig}>
                    //             <span>Config users</span>
                    //         </button>

                    //         {/* TODO: CONDIF Links <button className="button" onClick={openConfig}>
                    //             <span>Config Links</span>
                    //         </button> */}

                    //         { configUsers &&
                    //             <div className="config-users">
                    //                 <div className="users">
                    //                     { usersForm.map(((userValue, index) => (
                    //                         <div className="user" key={`config-user-${index}`}>
                    //                             <input value={userValue} onChange={(e) => updateUser(e.target.value, index)} />
                    //                             <button className="button small" onClick={() => removeUser(index)}>
                    //                                 <span>-</span>
                    //                             </button>
                    //                         </div>
                    //                     ))) }
                    //                 </div>

                    //                 <div className="config-buttons">
                    //                     <button className="button small" onClick={addNewUser}>
                    //                         <span>+</span>
                    //                     </button>

                    //                     <button className="button" onClick={saveUsers}>
                    //                         <span>Save</span>
                    //                     </button>

                    //                 </div>
                    //             </div>
                    //         }
                    //     </div>

                    //     <div className="cards">
                    //         { cards.map((_, index) =>
                    //             <div
                    //                 onClick={start}
                    //                 className={state === 'shuffling' ? 'card flip animate' : 'card flip'}
                    //                 style={{
                    //                     left: 50 + -(index * 1) + 'px',
                    //                     top: 40 + -(index * 1) + 'px',
                    //                     animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                    //                 }}
                    //                 key={`card-${index}`}
                    //             >
                    //                 <div className="inner">
                    //                     <div className="front">
                    //                         <div className="text"></div>
                    //                     </div>
                    //                     <div className="back"></div>
                    //                 </div>
                    //             </div>
                    //         )}
                    //         { state === 'shuffled' &&
                    //             users.map((user, index) => (
                    //                 <div
                    //                     className={dropState === 'distributed' ? 'card' : 'card flip-reverse'}
                    //                     key={`user-card-${user}`}
                    //                     style={{
                    //                         left: (dropState === 'dealing' || dropState === 'distributed') ? (400 + -(cards.length -1)) + (index * 200) + 'px' : 50 + -((cards.length -1) * 1) + 'px',
                    //                         top: 40 + -((cards.length -1) * 1) + 'px',
                    //                         transitionDelay: -(index * 0.25) + ((users.length - 1) * 0.25) + 's',
                    //                     }}
                    //                 >
                    //                     <div className="inner"
                    //                         style={{
                    //                             transitionDelay: -(index * 0.75) + ((users.length - 1) * 0.75) + 's',
                    //                         }}
                    //                     >
                    //                         <div className="front">
                    //                             <div className="text">{user}</div>
                    //                         </div>
                    //                         <div className="back"></div>
                    //                     </div>
                    //                 </div>
                    //             ))
                    //         }
                    //     </div>
                    // </div>
                    }

                    {currentStep.name === 'Games' && <div className="daily-links">
                        <Links />
                    </div>}

                    {currentStep.name === 'Issues' && <div className="issues">
                        <a className='anchor-link' href="https://ezzingsolar.atlassian.net/jira/dashboards/10011" target='_blank' rel="noreferrer">Jira Issues dashboard</a>
                    </div>}

                    {currentStep.name === 'Defectos' && <div className="defectos">
                        <p className='anchor-link'>Defectos</p>
                    </div>}

                    {currentStep.name === 'Nuevos desarrollos' && <div className="defectos">
                        <p className='anchor-link'>Nuevos desarrollos</p>
                    </div>}

                    {currentStep.name === 'Dudas' && <div className="defectos">
                        <p className='anchor-link'>Dudas</p>
                    </div>}
                </div>

            </div>
        </div>
    )
}
export default DailyV2;
