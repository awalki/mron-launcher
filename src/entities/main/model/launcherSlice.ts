import { createSlice } from '@reduxjs/toolkit'

interface LauncherState {
	launcher: {
		isInstalled: boolean
		isInstalling: boolean
		isOutdated: boolean
	}
}

const initialState: LauncherState = {
	launcher: {
		isInstalled: false,
		isInstalling: false,
		isOutdated: false,
	},
}

const launcherSlice = createSlice({
	name: 'launcher',
	initialState,
	reducers: {
		setInstalled: state => {
			state.launcher.isInstalled = true
			state.launcher.isInstalling = false
			state.launcher.isOutdated = false
		},
		setInstallling: state => {
			state.launcher.isInstalling = true
		},
		setOutdated: state => {
			state.launcher.isOutdated = true
		},
		reset: state => {
			console.log(state)
			return initialState
		},
	},
})

export const { setInstalled, setInstallling, setOutdated, reset } =
	launcherSlice.actions

export default launcherSlice.reducer
