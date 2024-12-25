import { RootState } from '@/app/store'
import { handleInstall } from '@/entities/install/lib/installMronLatest'
import { Button } from '@/shared/ui/button'
import { dispatch as storeDispatch } from '@/shared/utils/storeHelper'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function Update() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)

	return (
		<Button
			className='w-44 font-paragraph font-bold bg-blue-400 hover:bg-blue-500'
			onClick={() => handleInstall(storeDispatch)}
			disabled={launcher.isInstalling}
		>
			{launcher.isInstalling ? (
				<span className='flex flex-row items-center'>
					<Loader2 className='animate-spin mr-2' />
					Updating...
				</span>
			) : (
				'Update MRON'
			)}
		</Button>
	)
}
