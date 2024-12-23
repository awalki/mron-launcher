import { Toaster } from '@/components/ui/toaster'
import { ReactNode } from 'react'
import { ThemeProvider } from './components/theme-provider'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<>
			<main className='flex flex-col h-screen justify-center pb-12 select-none'>
				<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
					{children}
				</ThemeProvider>
			</main>
			<Toaster />
		</>
	)
}
