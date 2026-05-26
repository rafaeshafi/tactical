import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TacticaL — European Football Tactics',
  description: "Deep tactical analysis for Europe's top 5 football leagues",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-[#0a0f0d] text-[#e8f5e9] antialiased`}>
        {children}
      </body>
    </html>
  )
}
