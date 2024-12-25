import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Toaster } from '@/shared/ui/toaster'
import { open } from '@tauri-apps/plugin-shell'
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
					<code className='bg-[#0d0d0d] p-1 px-3 rounded-md'>
						<button
							onClick={() => {
								const logsPath = localStorage.getItem('logs-path')
								if (logsPath) {
									open(logsPath)
								}
							}}
						>
							errors? CTRL + SHIFT + J
						</button>
					</code>
				</span>
				<span className='absolute bottom-3 right-3 text-xs'>
					<code className='bg-[#0d0d0d] p-1 px-3 rounded-md'>
						<a href='https://github.com/awalki/mron-launcher' target='_blank'>
							dev: awalki
						</a>
					</code>
				</span>
			</main>
			<Toaster />
		</>
	)
}
