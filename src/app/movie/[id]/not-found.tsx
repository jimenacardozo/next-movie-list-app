import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <h2 className="text-4xl font-bold text-white">404</h2>
      <p className="text-gray-400 text-lg">No encontramos esa película.</p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
