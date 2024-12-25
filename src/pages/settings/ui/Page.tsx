import { Settings } from '@/features/settings'
import { ArrowBigLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function Page() {
	return (
		<>
			<>
				<Link to={'/'}>
					<ArrowBigLeft className='absolute top-4 left-4' />
				</Link>
				<Settings />
			</>
		</>
	)
}
