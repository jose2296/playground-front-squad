import { useRouletteStore } from '@/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardsGame from './CardsGame/CardsGame';

const DailyGame = () => {
    // const { previousStep, nextStep } = useOutletContext<HOCFunctions>();
    const { selectedItem } = useRouletteStore();
    const navigate = useNavigate();
    const [gameIframeSrc, setGameIframeSrc] = useState<string | null>(null);

    useEffect(() => {
        if (selectedItem?.type?.slug === 'balls') {
            console.log('balls');
            const url = new URL('/games/game-build/index.html', location.origin);
            url.searchParams.append('mode', selectedItem.slug);
            if (selectedItem.modifier?.slug) {
                url.searchParams.append('modifier', selectedItem.modifier.slug);
            }

            setGameIframeSrc(url.href);
        }

        if (!selectedItem) {
            navigate('/daily');
        }
    }, [selectedItem]);


    return (
        <div>
            <div className='game'>
                {gameIframeSrc &&
                    <iframe src={gameIframeSrc} width={'500px'} height={'900px'} />
                }
                {selectedItem?.type?.slug === 'cards' &&
                    <CardsGame mode={selectedItem.slug} modifier={selectedItem.modifier} />
                }
            </div>
            {/* <button onClick={previousStep}>Previous</button>
            <button onClick={nextStep}>NEXT</button> */}
        </div>
    );
};

export default DailyGame;
