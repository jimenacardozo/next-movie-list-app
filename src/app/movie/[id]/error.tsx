'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <h2 className="text-3xl font-bold text-white">Algo salió mal</h2>
      <p className="text-gray-400">No pudimos cargar esta película. Puede ser un problema de red.</p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={unstable_retry}
          className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
