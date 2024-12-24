interface HeaderProps {
	title: string
	description: string
}

export default function SettingsHeader({ title, description }: HeaderProps) {
	return (
		<header className='flex items-center flex-col'>
			<h1 className='text-4xl px-4 pt-4 font-montserrat font-medium'>
				{title}
			</h1>
			<p className='px-5 font-mono'>{description}</p>
		</header>
	)
}
