import { ChangeEvent, useEffect, useState } from 'react';

interface Props {
    handleModalState: (state: 'showModal' | 'close') => void
}

const ConfigurationModal = ({ handleModalState }: Props) => {
    const [usersForm, setUsersForm] = useState<string[]>([]);

    useEffect(() => {
        getUsersFromLocalStorage();
    }, []);

    const getUsersFromLocalStorage = () => {
        const localUsers = localStorage.getItem('users');
        const usersParsed = localUsers ? JSON.parse(localUsers) : [];

        setUsersForm(usersParsed);
    };

    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(usersForm));

        handleModalState('close');
    };

    const changeUserName = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const _userForm = [...usersForm];
        _userForm[index] = event.target.value;
        setUsersForm([..._userForm]);
    };

    return (
        <>
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

export default ConfigurationModal;
