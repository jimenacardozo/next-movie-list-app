import Link from 'next/link'
import Image from 'next/image'
import faviconUrl from '../../public/favicon.png'
import { auth } from '@/auth'
import SignOutButton from './SignOutButton'

export default async function Header() {
  const session = await auth()

  return (
    <header className="flex items-center justify-between px-4">
      <Link href="/" className="text-white no-underline flex items-center">
        <Image className="w-7.5 h-7.5 m-3" src={faviconUrl} alt="" priority />
        CineVault
      </Link>
      <div className="flex items-center gap-4 mr-4">
        <Link href="/watchlist" className="text-white no-underline">Watchlist</Link>
        {session?.user ? (
          <>
            <span className="text-white/60 text-sm">{session.user.name ?? session.user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <Link href="/login" className="text-white no-underline text-sm">Sign in</Link>
        )}
      </div>
    </header>
  )
}
