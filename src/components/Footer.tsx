import Link from 'next/link';
import greyFaviconUrl from '../../public/greyfavicon.png';
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="text-[#7d7d7f] flex flex-col items-center justify-between lg:flex-row lg:m-4">
            <Link href={"/"} className="text-[#7d7d7f] no-underline flex items-center">
                <Image className="w-7.5 h-7.5 m-3" src={greyFaviconUrl} alt="CineVault Logo" priority/>
                CineVault
            </Link>
            <span className="text-[0.8rem] text-center">All movie data is fictional and for demonstration purposes only.</span>
        </footer>
    );
}
