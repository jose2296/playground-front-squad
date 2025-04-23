import FlippingCard, { FlippingCardProps } from '@/components/FlippingCard';

export const FrontCardContent = ({ content }: { content?: string }) => (
    <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-emerald-500 via-emerald-700 to-emerald-800'}>
        <h1 className='text-base-content text-2xl 2xl:text-3xl font-bold'>{content}</h1>
    </div>
);

export const BackCardContent = () => (
    <div className={'rounded-xl w-full h-full p-5 flex items-center justify-center border-4 border-primary-content bg-gradient-to-t from-purple-500 via-purple-700 to-purple-800'} />
);

interface CardProps extends Omit<FlippingCardProps, 'frontContent' | 'backContent'> {
    content?: string;
}
const Card = ({ avoidFlip, content, flipped }: CardProps) => {

    return (
        <FlippingCard
            avoidFlip={avoidFlip}
            flipped={flipped}
            frontContent={<FrontCardContent content={content} />}
            backContent={<BackCardContent />}
        />
    );
};

export default Card;
