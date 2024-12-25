import { reset } from '@/entities/main/model/launcherSlice'
import { Name } from '@/features/name'
import { useToast } from '@/shared/hooks/use-toast'
import { Header } from '@/widgets/header/ui'
import { relaunch } from '@tauri-apps/plugin-process'
import { Wrench } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '../../../shared/ui/button'

export default function Settings() {
	const dispatch = useDispatch()
	const { toast } = useToast()

	async function clearCache() {
		if (localStorage.getItem('game-path')) {
			toast({
				title: 'Your install has been reset',
				description:
					"Return back and select correct game path then press 'Install'",
			})

			localStorage.clear()
			dispatch(reset())
			await relaunch()
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
			<div className='flex flex-col items-center'>
				<Header title='Config' description='Edit / Repair' />
				<Name />
				<Button
					variant={'link'}
					className='absolute top-3 right-2 decoration-transparent hover:[#151515] font-paragraph'
					onClick={clearCache}
				>
					Repair <Wrench />
				</Button>
			</div>
		</section>
	)
}
