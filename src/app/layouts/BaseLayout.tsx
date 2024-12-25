import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Toaster } from '@/shared/ui/toaster'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { ReactNode, useEffect } from 'react'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	useEffect(() => {
		async function checkInstallation() {
			const update = await check()
			if (update) {
				console.log(
					`found update ${update.version} from ${update.date} with notes ${update.body}`
				)
				let downloaded = 0
				let contentLength = 0
				// alternatively we could also call update.download() and update.install() separately
				await update.downloadAndInstall(event => {
					switch (event.event) {
						case 'Started':
							contentLength = event.data.contentLength ?? 0
							console.log(
								`started downloading ${event.data.contentLength} bytes`
							)
							break
						case 'Progress':
							downloaded += event.data.chunkLength
							console.log(`downloaded ${downloaded} from ${contentLength}`)
							break
						case 'Finished':
							console.log('download finished')
							break
					}
				})

				console.log('update installed')
				await relaunch()
			}
		}
		checkInstallation()
	}, [])

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
