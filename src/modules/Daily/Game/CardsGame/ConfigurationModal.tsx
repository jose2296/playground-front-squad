import { Player } from '@/utils/firebase';
import { handleModalState } from '@/utils/utils';
import { Fragment, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export const CONFIGURATION_USERS_MODAL_ID = 'configuration_users_modal';

interface Props {
    updateUsers?: (users: Player[]) => void
}
const ConfigurationModal = ({ updateUsers }: Props) => {
    const [usersForm, setUsersForm] = useState<Player[]>([]);

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

        handleModalState(CONFIGURATION_USERS_MODAL_ID, 'close');
        updateUsers?.(usersForm);
    };

    const removeUser = (index: number) => {
        const _users = [...usersForm];
        _users.splice(index, 1);
        setUsersForm([..._users]);
    };

    const changeUserKey = (value: string, key: keyof Player, index: number) => {
        const _userForm = [...usersForm];
        _userForm[index][key] = value;
        setUsersForm([..._userForm]);
    };

    return (
        <>
            {/* CONFIG USERS MODAL */}
            <dialog id={CONFIGURATION_USERS_MODAL_ID} className='modal'>
                <div className='modal-box'>
                    <h3 className='font-bold text-lg flex items-center gap-x-4'>
                        Configures the users
                        <button className='btn btn-circle btn-xs btn-outline' onClick={() => setUsersForm([...usersForm, { name: '', color: '#ff0000', score: 0 }])}>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                            </svg>
                        </button>
                    </h3>

                    <div className='py-4 flex flex-row flex-wrap gap-4 items-center'>
                        {usersForm && usersForm.map((user, index) => (
                            <Fragment key={`${user}-${index}-user`}>
                                <label className='input input-bordered flex items-center gap-2 w-[48%]'>
                                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-4 h-4 opacity-70'><path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' /></svg>
                                    <input type='text' className='grow w-full' placeholder='Username' defaultValue={user.name} onBlur={(e) => changeUserKey(e.target.value, 'name', index)}/>
                                </label>
                                <input type='color' defaultValue={user.color} onChange={(e) => changeUserKey(e.target.value, 'color', index)} />
                                <button className='btn btn-circle btn-xs btn-outline' onClick={() => removeUser(index)}>
                                    <FaTimes />
                                </button>
                            </Fragment>
                        ))}

                    </div>

                    <div className='modal-action'>
                        <button className='btn' onClick={() => handleModalState(CONFIGURATION_USERS_MODAL_ID, 'close')}>Close</button>
                        <button className='btn btn-primary' onClick={saveUsers}>Save</button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default ConfigurationModal;
