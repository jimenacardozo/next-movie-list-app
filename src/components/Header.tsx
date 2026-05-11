import Link from 'next/link'
import Image from 'next/image'
import faviconUrl from '../../public/favicon.png'
import SignOutButton from './SignOutButton'
import { Suspense } from 'react'
import { auth } from '@/auth'

async function AuthSection() {
  const session = await auth()

  if (session?.user) {
    return (
      <>
        <span className="text-white/60 text-sm">
          {session.user.name ?? session.user.email}
        </span>
        <SignOutButton />
      </>
    )
  }

  return (
    <Link href="/login" className="text-white no-underline text-sm">
      Sign in
    </Link>
  )
}

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4">
      <Link href="/" className="text-white no-underline flex items-center">
        <Image
          className="w-7.5 h-7.5 m-3"
          src={faviconUrl}
          alt=""
          priority
        />
        CineVault
      </Link>

      <div className="flex items-center gap-4 mr-4">
        <Link href="/watchlist" className="text-white no-underline">
          Watchlist
        </Link>

        <Suspense
          fallback={
            <span className="text-white/60 text-sm">
              Loading...
            </span>
          }
        >
          <AuthSection />
        </Suspense>
      </div>
    </header>
  )
}