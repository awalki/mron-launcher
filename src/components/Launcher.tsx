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
			if (localStorage.getItem('game-path') === null) return initCache()

			dispatch(setInstalled())
		}
		checkInstallation()
	}, [])

	return (
		<>
			<div className='flex flex-col h-screen justify-center pb-12'>
				<Header />
				<section className='flex justify-center flex-col'>
					<div className='flex flex-col items-center py-2'>
						<HandleButton />
					</div>
				</section>
			</div>
		</>
	)
}
