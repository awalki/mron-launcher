import { ThemeProvider } from '@/components/theme-provider'
import Launcher from './components/Launcher'
import './globals.css'
// import Counter from "./components/Counter";

function App() {
	return (
		<main className='overscroll-none'>
			{/* <Counter /> for test redux */}
			<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
				<Launcher />
			</ThemeProvider>
		</main>
	)
}

export default App
