import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AI_CONFIG } from './config/ai-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: AI_CONFIG.name,
  description: `Chat with ${AI_CONFIG.model} model`,
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
