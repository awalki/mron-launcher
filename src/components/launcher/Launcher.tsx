import { initCache } from '@/handlers/store'
import { setInstalled } from '@/state/launcher/launcherSlice'
import { Settings } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import Header from '../common/Header'
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
			<Link to={'/settings'}>
				<Settings className='absolute top-4 left-4' />
			</Link>
			<Header title='MRON' description='Best Warzone Mod' />
			<HandleButton />
		</>
	)
}
