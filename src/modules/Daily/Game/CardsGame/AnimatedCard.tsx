import { FlippingCardProps } from '@/components/FlippingCard';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useState } from 'react';
import Card from './Card';

interface CardProps extends Omit<FlippingCardProps, 'frontContent' | 'backContent'> {
    className?: string;
    content?: string;
    finalPosition?: { left: string; top: string };
    startPosition?: { left: string; top: string };
    delay?: number;
    onCompleteAnimationTimeout?: number;
}
const AnimatedCard = ({ className, avoidFlip, content, flipped, finalPosition, startPosition, delay, onCompleteAnimationTimeout }: CardProps) => {
    const [isFlipped, setIsFlipped] = useState(flipped);

    return (
        <motion.div
            className={clsx(`absolute ${className} card-item`)}
            animate={{ left: finalPosition?.left, top: finalPosition?.top }}
            style={{
                top: startPosition?.top,
                left: startPosition?.left
            }}
            transition={{
                duration: 0.6,
                delay: delay,
                easing: [0.61, 1, 0.88, 1],
                onComplete: () => {
                    setTimeout(() => {
                        setIsFlipped(!flipped);
                    }, onCompleteAnimationTimeout || 0);
                }
            }}
        >
            <Card
                avoidFlip={avoidFlip}
                flipped={isFlipped}
                content={content}
            />
        </motion.div>
    );
};

export default AnimatedCard;
