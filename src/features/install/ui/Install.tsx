import { RootState } from '@/app/store'
import {
	reset,
	setInstalled,
	setInstallling,
} from '@/entities/main/model/launcherSlice'
import { getGamePath } from '@/entities/main/model/storage'
import { Button } from '@/shared/ui/button'
import { invoke } from '@tauri-apps/api/core'
import { appCacheDir } from '@tauri-apps/api/path'
import { exists } from '@tauri-apps/plugin-fs'
import { download } from '@tauri-apps/plugin-upload'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

export default function Install() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)
	const dispatch = useDispatch()

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
		} catch (error) {
			console.error(error)
		}
	}

	async function handleInstall() {
		dispatch(setInstallling())

		// Open file dialog
		await getGamePath()

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
		}

		dispatch(setInstalled())
	}

	return (
		<Button
			className='w-44 font-paragraph font-bold bg-yellow-300 hover:bg-yellow-400'
			onClick={handleInstall}
			disabled={launcher.isInstalling}
		>
			{launcher.isInstalling ? (
				<span className='flex flex-row items-center'>
					<Loader2 className='animate-spin mr-2' />
					Installing...
				</span>
			) : (
				'Install'
			)}
		</Button>
	)
}
