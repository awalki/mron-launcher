import { reset } from '@/state/launcher/launcherSlice'
import { useDispatch } from 'react-redux'
import { Button } from '../ui/button'
import { PlayerName } from './PlayerName'

export default function HandleSettings() {
	const dispatch = useDispatch()

	function clearCache() {
		localStorage.removeItem('game-path')

		dispatch(reset())
	}

	return (
		<section className='flex justify-center flex-col'>
			<div className='flex flex-col items-center py-2'>
				<PlayerName />
				<Button className='mt-10' onClick={clearCache}>
					Clear Cache
				</Button>
			</div>
		</section>
	)
}
