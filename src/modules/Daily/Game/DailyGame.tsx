import { useRouletteStore } from '@/store';
import { applySpecialEvent } from '@/utils/firebase';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import BallsGame from './BallsGame/BallsGame';
import CardsGame from './CardsGame/CardsGame';

const DailyGame = () => {
    // const { previousStep, nextStep } = useOutletContext<HOCFunctions>();
    const { selectedItem } = useRouletteStore();

    useEffect(() => {
        if (selectedItem && selectedItem.event?.slug) {
            console.log('Applying special event:', selectedItem.event.slug);

            applySpecialEvent(selectedItem.event.slug);
        }
    }, [selectedItem]);

    if (!selectedItem) {
        return <Navigate to='/daily' />;
    }

    return (
        <div className='flex w-full justify-center'>
            {selectedItem?.type?.slug === 'balls' &&
                <BallsGame mode={selectedItem.slug} modifier={selectedItem.modifier}/>
            }
            {selectedItem?.type?.slug === 'cards' &&
                <CardsGame mode={selectedItem.slug} modifier={selectedItem.modifier} />
            }
            {/* <button onClick={previousStep}>Previous</button>
            <button onClick={nextStep}>NEXT</button> */}
        </div>
    );
};

export default DailyGame;
