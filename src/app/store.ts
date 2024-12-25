import { configureStore } from '@reduxjs/toolkit'
import launcherReducer from '../entities/main/model/launcherSlice'

export const store = configureStore({
	reducer: {
		launcher: launcherReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
