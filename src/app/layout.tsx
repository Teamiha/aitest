import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Response Repeatability Tester',
  description: 'Test the consistency of OpenAI models by generating responses with and without random seeds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
