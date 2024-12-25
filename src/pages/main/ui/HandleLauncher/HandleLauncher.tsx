import { RootState } from '@/app/store'
import { setInstalled } from '@/entities/main/model/launcherSlice'
import { initCache } from '@/entities/main/model/storage'
import Install from '@/features/install/ui/Install'
import Play from '@/features/play/ui/Play'
import { checkForAppUpdates } from '@/shared/utils/updater'
import { Header } from '@/widgets/header/ui'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function HandleButton() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)

	const dispatch = useDispatch()

	// Startup logic
	useEffect(() => {
		async function checkInstallation() {
			// Disable right click
			document.addEventListener('contextmenu', event => event.preventDefault())

			// Check if game is installed else initialize cache
			if (localStorage.getItem('game-path') === null) return initCache()

			dispatch(setInstalled())
			await checkForAppUpdates()
		}
		checkInstallation()
	}, [])

	return (
		<section className='flex justify-center flex-col'>
			<Header title='MRON' description='Best Warzone Mod' />
			<div className='flex flex-col items-center'>
				{launcher.isInstalled ? <Play /> : <Install />}
			</div>
		</section>
	)
}
