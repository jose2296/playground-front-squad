import { ChangeEvent, useEffect, useState } from 'react';

// const cards = [...Array(10)];

type ShuffleStates = 'initial' | 'ordering' | 'ordered';

const DailyCards = () => {
    const [usersForm, setUsersForm] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [orderState, setOrderState] = useState<ShuffleStates>('initial');

    useEffect(() => {
        getUsersFromLocalStorage();
    }, []);

    const getUsersFromLocalStorage = () => {
        const localUsers = localStorage.getItem('users');
        const usersParsed = localUsers ? JSON.parse(localUsers) : [];

        setUsersForm(usersParsed);
        setUsers(usersParsed);
    };

    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(usersForm));

        setUsers(usersForm);
        handleModalState('close');
    };

    const handleModalState = (state: 'showModal' | 'close') => {
        (document.getElementById('usersModal') as HTMLDialogElement)[state]();
    };

    const changeUserName = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const _userForm = [...usersForm];
        _userForm[index] = event.target.value;
        setUsersForm([..._userForm]);
    };

    const shuffleCards = () => {
        setOrderState('ordering');
        const usersClone = [...users].sort(() => Math.random() - 0.5);
        setUsers(usersClone);
        setTimeout(() => {
            setOrderState('ordered');
        }, 1000);
    };

    return (
        <>
            <div className='flex flex-col h-full justify-between'>
                <button className='btn btn-circle btn-outline absolute right-0' onClick={() => handleModalState('showModal')}>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' />
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                    </svg>
                </button>


                <div className='flex flex-col justify-center items-center h-full'>
                    {orderState === 'ordered' && users.map((user, index) => (
                        <h1 key={`${user}-${index}-user-item`} className='text-2xl font-bold'>{index + 1} - {user}</h1>
                    ))}
                </div>

                <div className='text-center'>
                    <button className='btn btn-primary px-12' onClick={shuffleCards}>
                        Order
                        {orderState === 'ordering' && <span className='loading loading-spinner'></span>}
                    </button>
                </div>
            </div>

            {/* CONFIG USERS MODAL */}
            <dialog id='usersModal' className='modal'>
                <div className='modal-box'>
                    <h3 className='font-bold text-lg flex items-center'>
                        Configures the users
                        <button className='btn btn-circle btn-xs btn-outline ml-4 mt-4' onClick={() => setUsersForm([...usersForm, ''])}>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                            </svg>
                        </button>
                    </h3>

                    <div className='py-4 flex flex-row flex-wrap gap-4'>
                        {usersForm && usersForm.map((user, index) => (
                            <label key={`${user}-${index}-user`} className='input input-bordered flex items-center gap-2 w-[48%]'>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-4 h-4 opacity-70'><path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' /></svg>
                                <input type='text' className='grow w-full' placeholder='Username' defaultValue={user} onBlur={(e) => changeUserName(e, index)}/>
                            </label>
                        ))}

                    </div>

                    <div className='modal-action'>
                        <button className='btn' onClick={() => handleModalState('close')}>Close</button>
                        <button className='btn btn-primary' onClick={saveUsers}>Save</button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default DailyCards;
