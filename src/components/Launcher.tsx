import Header from '@/components/Header'
import { initCache } from '@/handlers/store'
import { setInstalled } from '@/state/launcher/launcherSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import HandleButton from './HandleButton'

export default function Launcher() {
	const dispatch = useDispatch()

	// Startup logic
	useEffect(() => {
		async function checkInstallation() {
			// Disable right click
			document.addEventListener('contextmenu', event => event.preventDefault())

			// Check if game is installed else initialize cache
			if (localStorage.getItem('game-path') === null) return initCache()

			dispatch(setInstalled())
		}
		checkInstallation()
	}, [])

	return (
		<>
			<Header />
			<HandleButton />
		</>
	)
}
