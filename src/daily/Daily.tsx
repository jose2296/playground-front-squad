import { useEffect, useState } from 'react';
import './Daily.sass';

export const DailyShuffle = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [state, setState] = useState('ready');
    const [dropState, setDropState] = useState('no-dealing');

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
        setConfigUsers(true);
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
    }

    return (
        <div className="container">
            <div className="buttons">
                <button className="button" onClick={start}>
                    <span>Shuffle</span>
                </button>
                <button className="button" onClick={openConfig}>
                    <span>Config users</span>
                </button>

                { configUsers &&
                    <div className="config-users">
                        <div className="users">
                            { usersForm.map(((userValue, index) => (
                                <div className="user" key={`config-user-${index}`}>
                                    <input value={userValue} onChange={(e) => updateUser(e.target.value, index)} />
                                    <button className="button small" onClick={() => removeUser(index)}>
                                        <span>-</span>
                                    </button>
                                </div>
                            ))) }
                        </div>

                        <div className="config-buttons">
                            <button className="button small" onClick={addNewUser}>
                                <span>+</span>
                            </button>

                            <button className="button" onClick={saveUsers}>
                                <span>Save</span>
                            </button>

                        </div>
                    </div>
                }
            </div>

            <div className="cards">
                { cards.map((_, index) =>
                    <div
                        onClick={start}
                        className={state === 'shuffling' ? 'card flip animate' : 'card flip'}
                        style={{
                            left: 50 + -(index * 1) + 'px',
                            top: 40 + -(index * 1) + 'px',
                            animationDelay: -(index * 0.25) + ((cards.length - 1) * 0.25) + 's',
                        }}
                        key={`card-${index}`}
                    >
                        <div className="inner">
                            <div className="front">
                                <div className="text"></div>
                            </div>
                            <div className="back"></div>
                        </div>
                    </div>
                )}
                { state === 'shuffled' &&
                    users.map((user, index) => (
                        <div
                            className={dropState === 'distributed' ? 'card' : 'card flip-reverse'}
                            key={`user-card-${user}`}
                            style={{
                                left: (dropState === 'dealing' || dropState === 'distributed') ? (400 + -(cards.length -1)) + (index * 200) + 'px' : 50 + -((cards.length -1) * 1) + 'px',
                                top: 40 + -((cards.length -1) * 1) + 'px',
                                transitionDelay: -(index * 0.25) + ((users.length - 1) * 0.25) + 's',
                            }}
                        >
                            <div className="inner"
                                 style={{
                                    transitionDelay: -(index * 0.75) + ((users.length - 1) * 0.75) + 's',
                                }}
                            >
                                <div className="front">
                                    <div className="text">{user}</div>
                                </div>
                                <div className="back"></div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
