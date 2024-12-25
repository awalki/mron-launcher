import { Settings } from 'lucide-react'
import { Link } from 'react-router'
import './globals.css'
import HandleButton from './HandleLauncher/HandleLauncher'

export default function Page() {
	// TODO: Add errors logging

	return (
		<>
			<Link to={'/settings'}>
				<Settings className='absolute top-4 left-4' />
			</Link>
			<HandleButton />
		</>
	)
}
