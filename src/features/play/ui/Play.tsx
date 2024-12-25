import { Button } from '@/shared/ui/button'
import { invoke } from '@tauri-apps/api/core'
import { exit } from '@tauri-apps/plugin-process'

export default function Play() {
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

	return (
		<Button
			className='w-44 font-paragraph font-bold bg-emerald-500 hover:bg-emerald-600'
			onClick={handlePlay}
		>
			Play
		</Button>
	)
}
