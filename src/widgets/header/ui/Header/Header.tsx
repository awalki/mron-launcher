interface HeaderProps {
	title: string
	description: string
}

export default function Header({ title, description }: HeaderProps) {
	return (
		<header className='flex items-center flex-col mb-6'>
			<h1 className='text-4xl px-4 pt-3 font-header font-bold'>{title}</h1>
			<p className='px-5 font-paragraph'>{description}</p>
		</header>
	)
}
