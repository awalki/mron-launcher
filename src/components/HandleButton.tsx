import Install from '@/components/Install'
import Play from '@/components/Play'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'

export default function HandleButton() {
	const launcher = useSelector((state: RootState) => state.launcher.launcher)

	return <>{launcher.isInstalled ? <Play /> : <Install />}</>
}
