import { store } from '@/app/store'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import BaseLayout from '@/app/layouts/BaseLayout'
import Main from '@/pages/main/ui/Page'
import Settings from '@/pages/settings/ui/Page'
import { BrowserRouter, Route, Routes } from 'react-router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BaseLayout>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/settings' element={<Settings />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</BaseLayout>
)
