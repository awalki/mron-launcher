import { info } from '@tauri-apps/plugin-log'

export async function getLatestVersion() {
	const response = await fetch(
		'https://gist.githubusercontent.com/Ma3axucTKa/828b5bc8b155c07fbee1169c4d6c1b09/raw/833daf7aa41ad56a62d9e41c363ee24c9f48f0c9/latest'
	)

	const latestVersion = await response.text()

	info(`Latest MRON version: ${latestVersion}`)

	return latestVersion
}
