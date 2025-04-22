import { useEffect, useState } from 'react';
import { motion } from "motion/react";

export interface FlippingCardProps {
    flipped?: boolean;
    avoidFlip?: boolean;
    frontContent: JSX.Element;
    backContent: JSX.Element;
    flippedChanged?: (flipped: boolean) => void;
};
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
            className='transform-3d perspective-[1000px] cursor-pointer w-full h-full'
            onClick={handleFlipCard}
        >
            <motion.div
                className="w-full h-full relative transform-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: 0.6,
                    easing: [0.61, 1, 0.88, 1] // Curva personalizada
                }}
            >
                {/* Frente de la carta */}
                <motion.div
                    className={`
                        absolute w-full h-full backface-hidden
                        flex justify-center items-center
                        shadow-lg
                        rotate-y-180
                    `}
                >
                    {frontContent}
                </motion.div>

                {/* Dorso de la carta */}
                <motion.div
                    className={`
                        absolute w-full h-full backface-hidden
                        flex justify-center items-center
                        shadow-lg
                    `}
                >
                    {backContent}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FlippingCard;