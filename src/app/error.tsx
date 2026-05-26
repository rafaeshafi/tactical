'use client'

interface Props {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold text-[#e8f5e9]">Something went wrong</h2>
      <p className="text-sm text-gray-400 max-w-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#00ff85] text-black font-semibold rounded-lg hover:bg-[#00cc6a] transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
