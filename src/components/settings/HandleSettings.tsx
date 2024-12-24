import { useToast } from '@/hooks/use-toast'
import { reset } from '@/state/launcher/launcherSlice'
import { Wrench } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '../ui/button'
import { PlayerName } from './PlayerName'

export default function HandleSettings() {
	const dispatch = useDispatch()
	const { toast } = useToast()

	function clearCache() {
		if (localStorage.getItem('game-path')) {
			toast({
				title: 'Your install has been reset',
				description:
					"Return back and select correct game path then press 'Install'",
			})

			localStorage.removeItem('game-path')
			dispatch(reset())
		} else {
			toast({
				title: 'Install not found',
				description: 'Nothing to repair',
				variant: 'destructive',
			})
		}
	}

	return (
		<section className='flex justify-center flex-col'>
			<div className='flex flex-col items-center py-2'>
				<PlayerName />
				<Button
					variant={'link'}
					className='absolute top-3 right-2 decoration-transparent hover:[#151515] font-mono'
					onClick={clearCache}
				>
					Repair <Wrench />
				</Button>
			</div>
		</section>
	)
}
