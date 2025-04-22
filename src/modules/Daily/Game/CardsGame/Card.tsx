import FlippingCard, { FlippingCardProps } from '@/components/FlippingCard';

interface CardProps extends Omit<FlippingCardProps, 'frontContent' | 'backContent'> {
    content?: string;
}
const Card = ({ avoidFlip, content, flipped }: CardProps) => {

    return (
        <FlippingCard
            avoidFlip={avoidFlip}
            flipped={flipped}
            frontContent={
                <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-emerald-500 via-emerald-700 to-emerald-800'}>
                    <h1 className='text-base-content text-2xl 2xl:text-3xl'>{content}</h1>
                </div>
            }
            backContent={
                <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-purple-500 via-purple-700 to-purple-800'}
                />
            }
        />
    );
};

export default Card;
