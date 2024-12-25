import { info } from '@tauri-apps/plugin-log'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'

export async function checkForAppUpdates() {
	const update = await check()
	if (update) {
		info(
			`found update ${update.version} from ${update.date} with notes ${update.body}`
		)
		let downloaded = 0
		let contentLength = 0
		// alternatively we could also call update.download() and update.install() separately
		await update.downloadAndInstall(event => {
			switch (event.event) {
				case 'Started':
					contentLength = event.data.contentLength ?? 0
					info(`started downloading ${event.data.contentLength} bytes`)
					break
				case 'Progress':
					downloaded += event.data.chunkLength
					info(`downloaded ${downloaded} from ${contentLength}`)
					break
				case 'Finished':
					info('download finished')
					break
			}
		})

		info('update installed')
		await relaunch()
	} else {
		info('Update not found')
	}
}
