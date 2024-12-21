import { Button } from '@/components/ui/button'
import { reset } from '@/state/launcher/launcherSlice'
import { invoke } from '@tauri-apps/api/core'
import { exit } from '@tauri-apps/plugin-process'
import { useDispatch } from 'react-redux'

export default function Play() {
	const dispatch = useDispatch()

	async function handlePlay() {
		const exePath = `${localStorage.getItem(
			'game-path'
		)}/game_dx12_ship_replay.exe`

		try {
			await invoke('launch_game', { exePath })

			await exit(0)
		} catch (error) {
			console.error('Failed to launch game:', error)
		}
	}

	function clearCache() {
		localStorage.removeItem('game-path')

		dispatch(reset())
	}

	return (
		<div className='flex gap-2'>
			<Button className='w-1/2' onClick={handlePlay}>
				Play
			</Button>
			<Button className='w-1/2' onClick={clearCache}>
				Clear Cache
			</Button>
		</div>
	)
}
