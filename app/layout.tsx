import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { GlobalErrorBoundary } from '@/components/global-error-boundary'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400','500','600','700','800','900'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-body',
})
export const metadata: Metadata = {
  title: 'VT Groups - Land Distribution & Installment Management',
  description: 'AI-Powered Land Distribution & Installment Management System',
  icons: {
    icon: '/VT-Groups.png',
    shortcut: '/VT-Groups.png',
    apple: '/VT-Groups.png',
  },
}
export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <GlobalErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster richColors position="top-right" />
          <Analytics />
        </GlobalErrorBoundary>
      </body>
    </html>
  )
}
