import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SAINT Brand Brief - Herramienta de Brief Médico',
  description: 'Herramienta interactiva para crear briefs de marca en el sector salud',
  keywords: ['brand brief', 'marketing médico', 'salud', 'brief', 'SAINT'],
  authors: [{ name: 'SAINT Agency' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
