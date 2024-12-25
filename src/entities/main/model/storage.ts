import { appCacheDir, appLogDir, documentDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'

export async function initCache() {
	// Links
	localStorage.setItem(
		'documents-folder',
		'https://github.com/Ma3axucTKa/filesforupdater/releases/latest/download/toDocuments.zip'
	)
	localStorage.setItem(
		'game-folder',
		'https://github.com/Ma3axucTKa/filesforupdater/releases/latest/download/toGameFolder.zip'
	)
	localStorage.setItem(
		'config-folder',
		'https://github.com/Ma3axucTKa/filesforupdater/releases/latest/download/defaultConfig.zip'
	)

	// Paths
	localStorage.setItem(
		'documents-path',
		`${await documentDir()}/Call of Duty Modern Warfare`
	)
	localStorage.setItem('cache-path', await appCacheDir())
	localStorage.setItem('logs-path', await appLogDir())
}

export async function getGamePath() {
	const file = await open({
		multiple: false,
		directory: true,
	})

	if (file === null) return
	localStorage.setItem('game-path', file)
}
