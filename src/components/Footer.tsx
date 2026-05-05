import greyFaviconUrl from '../../public/greyfavicon.png';
import './../app/global.css';
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="text-[#7d7d7f] flex flex-col items-center justify-between">
            <a className="home footer-title flex items-center" href="#">
                <Image className="logo w-7.5 h-7.5 m-3" src={greyFaviconUrl} alt="CineVault Logo" priority/>
                CineVault
            </a>
            <span>All movie data is fictional and for demonstration purposes only.</span>
        </footer>
    );
}
