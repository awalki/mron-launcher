import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import Install from './Install'
import Play from './Play'

export default function HandleButton() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)

	return (
		<section className='flex justify-center flex-col'>
			<div className='flex flex-col items-center'>
				{launcher.isInstalled ? <Play /> : <Install />}
			</div>
		</section>
	)
}
