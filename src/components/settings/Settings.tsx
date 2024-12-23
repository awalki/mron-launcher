import { ArrowBigLeft } from 'lucide-react'
import { Link } from 'react-router'
import HandleSettings from './HandleSettings'
import SettingsHeader from './Header'

export default function Settings() {
	return (
		<>
			<Link to={'/'}>
				<ArrowBigLeft className='absolute top-4 left-4' />
			</Link>
			<SettingsHeader />
			<HandleSettings />
		</>
	)
}
