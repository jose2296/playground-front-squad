import FlippingCard, { FlippingCardProps } from '@/components/FlippingCard';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useState } from 'react';

export const CARD_SIZE = {
    width: 160,
    height: 240
};

const CardContent = ({ content, className }: { content?: JSX.Element; className?: string }) => (
    <div className={clsx(`rounded-lg w-full h-full p-5 flex items-center justify-center border-4 border-primary-content ${className}`, {
        'bg-gradient-to-t from-emerald-500 via-emerald-700 to-emerald-800': !!content,
        'bg-gradient-to-t from-purple-500 via-purple-700 to-purple-800': !content
    })}>
        {!!content && content}
    </div>
);


interface CardProps extends Omit<FlippingCardProps, 'frontContent' | 'backContent'> {
    className?: string;
    content?: string;
    finalPosition?: { left: string; top: string };
    startPosition?: { left: string; top: string };
    delay?: number;
    onCompleteAnimationTimeout?: number;
}
const Card = ({ className, avoidFlip, content, flipped, finalPosition, startPosition, delay, onCompleteAnimationTimeout }: CardProps) => {
    const [isFlipped, setIsFlipped] = useState(flipped);

    return (
        <motion.div
            className={clsx(`absolute ${className}`)}
            animate={{ left: finalPosition?.left, top: finalPosition?.top }}
            style={{
                top: startPosition?.top,
                left: startPosition?.left,
                width: `${CARD_SIZE.width}px`,
                height: `${CARD_SIZE.height}px`
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
            <FlippingCard
                avoidFlip={avoidFlip}
                flipped={isFlipped}
                frontContent={
                    <div className={'rounded-lg w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-emerald-500 via-emerald-700 to-emerald-800'}>
                        <h1 className='text-base-content text-3xl'>{content}</h1>
                    </div>
                }
                backContent={<div className={'rounded-lg w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-purple-500 via-purple-700 to-purple-800'} />}
            />
        </motion.div>
    );
};

export default Card;
