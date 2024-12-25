import {
	reset,
	setInstalled,
	setInstallling,
} from '@/entities/main/model/launcherSlice'
import { getGamePath } from '@/entities/main/model/storage'
import { getLatestVersion } from '@/shared/utils/latestVersion'
import { removeOldInstall } from '@/shared/utils/removeOldInstall'
import { invoke } from '@tauri-apps/api/core'
import { appCacheDir } from '@tauri-apps/api/path'
import { exists } from '@tauri-apps/plugin-fs'
import { error, info } from '@tauri-apps/plugin-log'
import { download } from '@tauri-apps/plugin-upload'
import { Dispatch } from 'redux'

async function downloadMRON() {
	await download(
		localStorage.getItem('documents-folder') as string,
		`${await appCacheDir()}/toDocuments.zip`
	)
	await download(
		localStorage.getItem('game-folder') as string,
		`${await appCacheDir()}/toGameFolder.zip`
	)
	await download(
		localStorage.getItem('config-folder') as string,
		`${await appCacheDir()}/defaultConfig.zip`
	)
	console.log(`${await appCacheDir()}/defaultConfig.zip`)
}

async function extractZip(srcZip: string, outDir: string) {
	try {
		await invoke('extract', { srcZip, outDir })

		info(`Extracted: ${srcZip} to ${outDir}`)
	} catch (err) {
		error(`Error while extracting archive ${err}`)
	}
}

export async function handleInstall(dispatch: Dispatch) {
	if (localStorage.getItem('game-path')) {
		info('Prerepairing for MRON Update...')

		try {
			await removeOldInstall('mron')
			await removeOldInstall('discord_game_sdk.dll')
			await removeOldInstall('script.gscbin')
		} catch (err) {
			error(`Error while deleting old install ${err}`)
		}

		localStorage.setItem('mron-version', await getLatestVersion())
	}

	// Set Installing or Updating state
	dispatch(setInstallling())

	// Open file dialog
	try {
		if (!localStorage.getItem('game-path')) await getGamePath()
	} catch (err) {}

	if (localStorage.getItem('game-path') === null) return dispatch(reset())

	// Install logic

	// Download mron archives to cache folder
	await downloadMRON()

	// Extract mron archives to correct paths
	await extractZip(
		`${localStorage.getItem('cache-path')}/toGameFolder.zip`,
		`${localStorage.getItem('game-path')}`
	)
	await extractZip(
		`${localStorage.getItem('cache-path')}/toDocuments.zip`,
		`${localStorage.getItem('documents-path')}`
	)

	// Extract default config if it doesn't exist
	if (
		!(await exists(
			`${localStorage.getItem('documents-path')}/players/autoexec.cfg`
		))
	) {
		await extractZip(
			`${localStorage.getItem('cache-path')}/defaultConfig.zip`,
			`${localStorage.getItem('documents-path')}`
		)
	} else {
		info(`Skipping config installation... autoexec.cfg already exists`)
	}

	dispatch(setInstalled())
}
