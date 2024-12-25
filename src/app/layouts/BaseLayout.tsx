import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Toaster } from '@/shared/ui/toaster'
import { ReactNode } from 'react'

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
				<span className='absolute bottom-3 left-3 text-xs'>
					<code className='bg-zinc-900 p-1 px-3 rounded-md'>
						Console: CTRL + SHIFT + J
					</code>
				</span>
			</main>
			<Toaster />
		</>
	)
}
