import { HOCFunctions } from '@/main';
import { useEffect, useState } from 'react';

const LINKS = [
    {
        name: 'Wordle (ES)',
        url: 'https://lapalabradeldia.com',
        icon: '/la-palabra-del-dia.png',
        completed: false
    },
    {
        name: 'Wordle (EN)',
        url: 'https://www.nytimes.com/games/wordle/index.html',
        icon: 'https://www.nytimes.com/games-assets/v2/metadata/wordle-favicon.ico?v=v2208011150',
        completed: false
    },
    {
        name: 'Worldle',
        url: 'https://worldle.teuteuf.fr/',
        icon: 'https://worldle.teuteuf.fr/logo192.png',
        completed: false
    },
    {
        name: 'Framed',
        url: 'https://framed.wtf/',
        icon: 'https://framed.wtf/favicon.ico',
        completed: false
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagdle.org/',
        icon: 'https://www.flagdle.org/favicon-16x16.png',
        completed: false
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagdle.app/',
        icon: 'https://www.flagdle.app/logo192.png',
        completed: false
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagle.io/',
        icon: 'https://www.flagle.io/favicon.ico',
        completed: false
    }
];

const GIPHY_API_KEY = 'lKqBhAgeKOGx2rJveh7LZJpvgRUpz8ss';

export const Links = ({ nextStep }: HOCFunctions) => {
    const [complete, setComplete] = useState(false);
    const [randomGif, setRandomGif] = useState(null);
    const [links, setLinks] = useState(LINKS);

    const handleClickLink = (index: number) => {
        window.open(links[index].url);
        const newLinks = links.map((link, _index) => ({
            ...link,
            completed: link.completed ? true : index === _index
        }));
        setLinks(newLinks);

        const allLinksCompleted = newLinks.every(link => link.completed);

        if (allLinksCompleted) {
            setComplete(true);
        }
    };

    useEffect(() => {
        getRandomGif();
    }, []);

    // const getGif = async () => {
    //     const randomGifResponse = await fetch(`https://api.giphy.com/v1/randomid?api_key=${GIPHY_API_KEY}`);
    //     const { data: { random_id } } = await randomGifResponse.json();

    //     const giphyApiSearchUrl = `https://api.giphy.com/v1/gifs/search?random_id=${random_id}&api_key=${GIPHY_API_KEY}&q=congratulations&limit=1&offset=0&rating=g&lang=es&bundle=messaging_non_clips`;
    //     const response = await fetch(giphyApiSearchUrl);
    //     const { data: [{ images: { original: { url }} }]} = await response.json();

    //     console.log(url);
    //     setRandomGif(url);
    // };

    const getRandomGif = async () => {

        const randomGifResponse = await fetch(`https://api.giphy.com/v1/randomid?api_key=${GIPHY_API_KEY}`);
        const { data: { random_id } } = await randomGifResponse.json();

        if (random_id) {
            const getGifResponse = await fetch(`https://api.giphy.com/v1/gifs/random?random_id=${random_id}&api_key=${GIPHY_API_KEY}&tag=congratulations`);
            const { data: { images: { original: { url }} }} = await getGifResponse.json();
            setRandomGif(url);
        }
    };

    return (
        <div className='h-full flex items-center justify-center p-10'>
            <div className='flex flex-row gap-10 h-fit flex-wrap justify-center items-center'>
                {!complete && links.map((link, index) => (
                    <div
                        key={index}
                        className={`group flex flex-col justify-center items-center cursor-pointer w-[150px] h-[150px] rounded-box border-4 bg-neutral ${link.completed ? 'border-success' : 'hover:border-primary transition-[border]'}`}
                        onClick={() => handleClickLink(index)}
                    >
                        {link.icon && <img className='w-[60px]' src={link.icon} alt={link.name} />}
                        <p className={`pt-4 font-bold ${link.completed ? '' : 'group-hover:text-primary transition-[color]'}`}>{link.name}</p>
                    </div>
                ))}
                {
                    complete && randomGif && <div className='flex flex-col gap-8'>
                        <div className='border-4 rounded-box border-primary'>
                            <img className='rounded-box' src={randomGif} alt='gif' />
                        </div>

                        <div className='text-center'>
                            <button className='btn btn-primary px-14' onClick={nextStep}>Next</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};
