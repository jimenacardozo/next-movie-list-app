import faviconUrl from '../../public/favicon.png';
import './../app/global.css';
import Image from 'next/image';

export default function Header() {
    return (
        <header>
            <a className="home flex items-center" href="#">
                <Image className="w-7.5 h-7.5 m-3" src={faviconUrl} alt="" priority/>
                CineVault
            </a>
        </header>
    );
}
