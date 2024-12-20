import { appCacheDir, documentDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'

export async function initCache() {
	// Links
	localStorage.setItem(
		'documents-folder',
		'https://www.dropbox.com/scl/fi/6kpzq3o4tyr9xi2kdeb9p/toDocuments.zip?rlkey=u1w153jbv63n08orgkhp0v7z6&st=hfe59bxc&dl=1'
	)
	localStorage.setItem(
		'game-folder',
		'https://www.dropbox.com/scl/fi/bbn9fttza9wcjcpvkmwq7/toGameFolder.zip?rlkey=o511nhjbz8sumtad2tjy7cgk6&st=uebfruxd&dl=1'
	)
	localStorage.setItem(
		'config-folder',
		'https://www.dropbox.com/scl/fi/ihlnoyvcau6ryyy9q0bqq/defaultConfig.zip?rlkey=80xdy2vc6kejjib4roc9e5lkk&st=g0i38kut&dl=1'
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

export const links = {
	documents: localStorage.getItem('documents-folder'),
	game: localStorage.getItem('game-folder'),
	config: localStorage.getItem('config-folder'),
}

export const staticPaths = {
	documents: localStorage.getItem('documents-path'),
	cache: localStorage.getItem('cache-path'),
}
