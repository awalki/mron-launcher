import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './state/store'

import { BrowserRouter, Route, Routes } from 'react-router'
import LauncherPage from './LauncherPage'
import Layout from './Layout'
import SettingsPage from './SettingsPage'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Layout>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<LauncherPage />} />
					<Route path='/settings' element={<SettingsPage />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</Layout>
)
