import { store } from '@/app/store'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import BaseLayout from '@/app/layouts/BaseLayout'
import Main from '@/pages/main/ui/Page'
import Settings from '@/pages/settings/ui/Page'
import { BrowserRouter, Route, Routes } from 'react-router'

import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'

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
				console.log(`started downloading ${event.data.contentLength} bytes`)
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BaseLayout>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/settings' element={<Settings />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</BaseLayout>
)
