import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface FlippingCardProps {
    flipped?: boolean;
    avoidFlip?: boolean;
    frontContent: JSX.Element;
    backContent: JSX.Element;
    flippedChanged?: (flipped: boolean) => void;
}

const FlippingCard = ({ flipped, frontContent, backContent, avoidFlip, flippedChanged }: FlippingCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(!!flipped);
    }, [flipped]);

    const handleFlipCard = () => {
        if (avoidFlip) return;
        setIsFlipped(!isFlipped);
        flippedChanged?.(!isFlipped);
    };

    return (
        <div
            className='cursor-pointer w-full h-full perspective-1000'
            onClick={handleFlipCard}
        >
            <motion.div
                className='w-full h-full relative preserve-3d'
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: 0.6,
                    easing: [0.61, 1, 0.88, 1]
                }}
            >
                {/* Frente de la carta */}
                <div
                    className='absolute w-full h-full backface-hidden'
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {frontContent}
                </div>

                {/* Dorso de la carta */}
                <div
                    className='absolute w-full h-full backface-hidden'
                    style={{ transform: 'rotateY(0deg)' }}
                >
                    {backContent}
                </div>
            </motion.div>
        </div>
    );
};

export default FlippingCard;
