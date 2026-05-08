import Link from 'next/link';
import faviconUrl from '../../public/favicon.png';
import './../app/global.css';
import Image from 'next/image';

export default function Header() {
    return (
            <header className="flex items-center justify-between px-4">
                <Link href={"/"} className="home flex items-center">
                    <Image className="w-7.5 h-7.5 m-3" src={faviconUrl} alt="" priority/>
                    CineVault
                </Link>
                <Link href="/watchlist" className="text-white no-underline mr-4">Watchlist</Link>
            </header>
    );
}
