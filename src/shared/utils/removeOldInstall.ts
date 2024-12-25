import { invoke } from '@tauri-apps/api/core'
import { info } from '@tauri-apps/plugin-log'

export async function removeOldInstall(path: string) {
	invoke('remove_path', {
		path: `${localStorage.getItem('game-path')}/${path}`,
	})

	info(`Removed ${path}`)
}
