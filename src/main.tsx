import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './state/store'

import { BrowserRouter, Route, Routes } from 'react-router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />} />
				// TODO: Add settings route to edit player_name or something else
			</Routes>
		</BrowserRouter>
	</Provider>
)
