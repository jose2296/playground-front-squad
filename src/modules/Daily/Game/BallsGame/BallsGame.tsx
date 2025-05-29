import { Player } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import { Item } from '../../Roulette/Roulette';

const BallsGame = ({ mode, modifier }: { mode: string; modifier: Item['modifier'] }) => {
    const [gameIframeSrc, setGameIframeSrc] = useState<string | null>(null);

    useEffect(() => {
        const url = new URL('/games/game-build/index.html', location.origin);
        url.searchParams.append('mode', mode);

        const localUsers = localStorage.getItem('users');
        if (localUsers) {
            const users: Player[] = JSON.parse(localUsers);
            users.forEach((user, index) => {
                url.searchParams.append(`players[${index}][name]`, user.name);
                url.searchParams.append(`players[${index}][color]`, user.color);
            });
        }

        if (modifier?.slug) {
            url.searchParams.append('modifier', modifier.slug);
        }

        console.log(url.href);

        setGameIframeSrc(url.href);
    }, []);

    return (
        <>
            {gameIframeSrc &&
                <iframe src={gameIframeSrc} allow='cross-origin-isolated' className='h-full w-sm outline-0 rounded-xl' />
            }
        </>
    );
};

export default BallsGame;
