import { appCacheDir, documentDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'

export async function initCache() {
	// Links
	localStorage.setItem(
		'documents-folder',
		'https://www.dropbox.com/scl/fi/yzdq21moyh4mz5x5izh91/toDocuments.zip?rlkey=clqzqj35ak2p45gcpof0n89vs&st=ict0vzej&dl=1'
	)
	localStorage.setItem(
		'game-folder',
		'https://www.dropbox.com/scl/fi/wc4xle1cyjjpwb03xcrfm/toGameFolder.zip?rlkey=nx884i7ziqnm9cm34uz7rviu6&st=16h7pgam&dl=1'
	)
	localStorage.setItem(
		'config-folder',
		'https://www.dropbox.com/scl/fi/ddasyl1ix8siom50kq2zw/defaultConfig.zip?rlkey=jvo86a2xv5yae0yje3waga20n&st=gsycmiye&dl=1'
	)

	// Paths
	localStorage.setItem(
		'documents-path',
		`${await documentDir()}/Call of Duty Modern Warfare`
	)
	localStorage.setItem('cache-path', await appCacheDir())
}

export async function getGamePath() {
	const file = await open({
		multiple: false,
		directory: true,
	})

	if (file === null) return
	localStorage.setItem('game-path', file)
}
