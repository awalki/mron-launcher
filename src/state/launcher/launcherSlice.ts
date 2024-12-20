import { createSlice } from '@reduxjs/toolkit'

interface LauncherState {
	launcher: {
		isInstalled: boolean
		isInstalling: boolean
		isPlaying: boolean
	}
}

const initialState: LauncherState = {
	launcher: {
		isInstalled: false,
		isInstalling: false,
		isPlaying: false,
	},
}

const launcherSlice = createSlice({
	name: 'launcher',
	initialState,
	reducers: {
		setInstalled: state => {
			state.launcher.isInstalled = true
		},
		setInstallling: state => {
			state.launcher.isInstalling = true
		},
		setPlaying: state => {
			state.launcher.isPlaying = true
		},
		reset: state => {
			console.log(state)
			return initialState
		},
	},
})

export const { setInstalled, setInstallling, setPlaying, reset } =
	launcherSlice.actions

export default launcherSlice.reducer
