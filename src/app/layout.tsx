import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaApp - Ucz sie jezykow',
  description: 'Aplikacja do nauki angielskiego i hiszpanskiego z fiszkami, quizami i algorytmem powtórek',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
