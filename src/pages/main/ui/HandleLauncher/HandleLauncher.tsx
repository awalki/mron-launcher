import { RootState } from '@/app/store'
import { setInstalled, setOutdated } from '@/entities/main/model/launcherSlice'
import { initCache } from '@/entities/main/model/storage'
import { Install } from '@/features/install'
import { Play } from '@/features/play'
import { Update } from '@/features/update'
import { getLatestVersion } from '@/shared/utils/latestVersion'
import { checkForAppUpdates } from '@/shared/utils/updater'
import { Header } from '@/widgets/header/ui'
import { attachConsole, info } from '@tauri-apps/plugin-log'
import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

export default function HandleButton() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)

	const dispatch = useDispatch()

	// Startup logic
	useEffect(() => {
		async function checkInstallation() {
			// Disable right click && Forward logs to console
			await attachConsole()
			document.addEventListener('contextmenu', event => event.preventDefault())

			// Check if game is installed else initialize cache
			if (localStorage.getItem('game-path') === null) return initCache()

			dispatch(setInstalled())

			// MRON Updater logic
			const latestVersion = await getLatestVersion()

			if (!localStorage.getItem('mron-version'))
				return localStorage.setItem('mron-version', latestVersion)

			if (localStorage.getItem('mron-version') !== latestVersion) {
				dispatch(setOutdated())

				info('MRON Update Found')
			}

			await checkForAppUpdates()
		}
		checkInstallation()
	}, [])

	return (
		<section className='flex justify-center flex-col'>
			<Header title='MRON' description='Best Warzone Mod' />
			<div className='flex flex-col items-center'>
				{launcher.isOutdated ? (
					<Update />
				) : launcher.isInstalled ? (
					<Play />
				) : (
					<Install />
				)}
			</div>
		</section>
	)
}
