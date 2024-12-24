import { ArrowBigLeft } from 'lucide-react'
import { Link } from 'react-router'
import Header from '../common/Header'
import HandleSettings from './HandleSettings'

export default function Settings() {
	return (
		<>
			<Link to={'/'}>
				<ArrowBigLeft className='absolute top-4 left-4' />
			</Link>
			<Header title='Config' description='Edit / Repair' />
			<HandleSettings />
		</>
	)
}
