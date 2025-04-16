import { HOCFunctions } from "@/main";
import { useRouletteStore } from "@/store";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Cards from "./Cards";

const DailyGame = () => {
    const { previousStep, nextStep } = useOutletContext<HOCFunctions>();
    const { item } = useRouletteStore();
    const [gameIframeSrc, setGameIframeSrc]= useState<string | null>(null);

    useEffect(() => {
        console.log(item);
        if (item?.type?.slug === 'balls') {
            console.log('balls');
            const url = new URL('/games/game-build/index.html', location.origin);
            url.searchParams.append('mode', item.slug);
            if (item.modifier?.slug) {
                url.searchParams.append('modifier', item.modifier.slug);
            }
            
            setGameIframeSrc(url.href);
        }
    }, [item]);
    
    return (
        <div>
            <div className="game">
                {gameIframeSrc && 
                    <iframe src={gameIframeSrc} width={'500px'} height={'900px'} />
                }
                {item?.type?.slug === 'cards' &&
                    <Cards mode={item.slug} modifier={item.modifier} />
                }
            </div>
            <button onClick={nextStep}>NEXT</button>
        </div>
    );
}

export default DailyGame;