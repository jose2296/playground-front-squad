import { useEffect, useState } from 'react';
import { Item } from '../../Roulette/Roulette';

const BallsGame = ({ mode, modifier }: { mode: string; modifier: Item['modifier'] }) => {
    const [gameIframeSrc, setGameIframeSrc] = useState<string | null>(null);

    useEffect(() => {
        const url = new URL('/games/game-build/index.html', location.origin);
        url.searchParams.append('mode', mode);
        if (modifier?.slug) {
            url.searchParams.append('modifier', modifier.slug);
        }

        setGameIframeSrc(url.href);
    }, []);

    return (
        <>
            {gameIframeSrc &&
                <iframe src={gameIframeSrc} className='h-full w-sm outline-0 rounded-xl' />
            }
        </>
    );
};

export default BallsGame;
