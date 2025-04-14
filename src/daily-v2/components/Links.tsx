import { useEffect, useState } from 'react';
import './links.sass';

const links = [
    {
        name: 'Wordle (ES)',
        url: 'https://lapalabradeldia.com',
        icon: 'https://wordly.org/favicon-32x32.png'
    },
    {
        name: 'Wordle (EN)',
        url: 'https://www.nytimes.com/games/wordle/index.html',
        icon: 'https://www.nytimes.com/games-assets/v2/metadata/wordle-favicon.ico?v=v2208011150',
    },
    {
        name: 'Worldle',
        url: 'https://worldle.teuteuf.fr/',
        icon: 'https://worldle.teuteuf.fr/logo192.png'
    },
    {
        name: 'Framed',
        url: 'https://framed.wtf/',
        icon: 'https://framed.wtf/favicon.ico'
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagdle.org/',
        icon: 'https://www.flagdle.org/favicon-16x16.png'
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagdle.app/',
        icon: 'https://www.flagdle.app/logo192.png'
    },
    {
        name: 'Flagdle',
        url: 'https://www.flagle.io/',
        icon: 'https://www.flagle.io/favicon.ico'
    }
]

const GIPHY_API_KEY = 'lKqBhAgeKOGx2rJveh7LZJpvgRUpz8ss';

export const Links = () => {
    const [currentIndexLink, setCurrentIndexLink] = useState(0);
    const [complete, setComplete] = useState(false);
    const [randomGif, setRandomGif] = useState(null);

    const handleClickLink = () => {
        window.open(links[currentIndexLink].url);

        const nextIndex = currentIndexLink + 1;

        if (nextIndex <= links.length - 1) {
            setCurrentIndexLink(nextIndex)
        } else {
            setComplete(true);
        }
    }

    useEffect(() => {
        getRandomGif()
    }, []);

    const getGif = async () => {
        const randomGifResponse = await fetch(`https://api.giphy.com/v1/randomid?api_key=${GIPHY_API_KEY}`);
        const { data: { random_id } } = await randomGifResponse.json();

        const giphyApiSearchUrl = `https://api.giphy.com/v1/gifs/search?random_id=${random_id}&api_key=${GIPHY_API_KEY}&q=congratulations&limit=1&offset=0&rating=g&lang=es&bundle=messaging_non_clips`;
        const response = await fetch(giphyApiSearchUrl);
        const { data: [{ images: { original: { url }} }]} = await response.json();

        console.log(url);
        setRandomGif(url)
    }

    const getRandomGif = async () => {

        const randomGifResponse = await fetch(`https://api.giphy.com/v1/randomid?api_key=${GIPHY_API_KEY}`);
        const { data: { random_id } } = await randomGifResponse.json();

        if (random_id) {
            const getGifResponse = await fetch(`https://api.giphy.com/v1/gifs/random?random_id=${random_id}&api_key=${GIPHY_API_KEY}&tag=congratulations`);
            const { data: { images: { original: { url }} }} = await getGifResponse.json();
            console.log(url);
            setRandomGif(url)
        }
    }

    return (
        <div className="links-container">
                {!complete &&
                    <div className="link" onClick={handleClickLink}>
                        {links[currentIndexLink].icon && <img src={links[currentIndexLink].icon} alt={links[currentIndexLink].name} />}
                        <p>{links[currentIndexLink].name}</p>
                    </div>
                }
                {
                    complete && randomGif && <div className="link-complete">
                        <img src={randomGif} alt="gif" />
                    </div>
                }
        </div>
    )
}
