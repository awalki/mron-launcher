import { ThemeProvider } from '@/components/theme-provider'
import Launcher from './components/Launcher'
import './globals.css'

function App() {
	// TODO: Add errors logging

	return (
		<main className='flex flex-col h-screen justify-center pb-12'>
			<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
				<Launcher />
			</ThemeProvider>
		</main>
	)
}

export default App
