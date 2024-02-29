import { useState } from 'react';
import './links.sass';
const links = [
    {
        name: 'Wordle (ES)',
        url: 'https://lapalabradeldia.com',
        icon: 'https://lapalabradeldia.com/favicon.ico'
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
    // {
    //     name: 'Moviedle',
    //     url: 'https://www.moviedle.app/likewise.html',
    //     icon: 'https://www.moviedle.app/logo180.png'
    // },
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

export const Links = () => {
    const [currentIndexLink, setCurrentIndexLink] = useState(0);
    const [complete, setComplete] = useState(false);

    const handleClickLink = () => {
        const nextIndex = currentIndexLink + 1;
        if (nextIndex <= links.length - 1) {
            setCurrentIndexLink(nextIndex)
        } else {
            setComplete(true);
        }
    }

    return (
        <div className="links-container">
                {!complete &&
                    <a className="link" href={links[currentIndexLink].url} target='_blank' rel="noreferrer" onClick={handleClickLink}>
                        {links[currentIndexLink].icon && <img src={links[currentIndexLink].icon} alt={links[currentIndexLink].name} />}
                        <p>{links[currentIndexLink].name}</p>
                    </a>
                }
                {
                    complete && <div className="link-complete">
                        <img src="https://media1.tenor.com/m/Bysws45JqI8AAAAC/congratulations-congrats.gif" alt="gif" />
                    </div>
                }
{/*
            {links.map((link, index) => (
                <div key={`link-${index}-${link.name}`} className="link">
                    <a href={link.url} target='_blank' rel="noreferrer">
                        {link.icon && <img src={link.icon} alt={link.name} />}
                        <p>{link.name}</p>
                    </a>
                    <div className="spacer" />
                </div>
            ))} */}
        </div>
    )
}
