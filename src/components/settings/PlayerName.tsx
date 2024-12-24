'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { readTextFileLines, writeTextFile } from '@tauri-apps/plugin-fs'
import { Check } from 'lucide-react'

const FormSchema = z.object({
	username: z
		.string()
		.max(16, {
			message: 'Must be at most 16 characters.',
		})
		.min(3, {
			message: 'Must be at least 3 characters.',
		}),
})

export function PlayerName() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: '',
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		toast({
			title: 'Username successfully applied:',
			description: <code className='text-white'>{data.username}</code>,
		})

		localStorage.setItem('player-name', data.username)

		let ans = []

		const lines = await readTextFileLines(
			`${localStorage.getItem('documents-path')}/players/autoexec.cfg`
		)
		for await (const line of lines) {
			if (line.includes('player_name')) {
				ans.push(`player_name ${data.username}`)
			} else {
				ans.push(line.replace(/\0[\s\S]*$/g, ''))
			}
		}
		console.log(ans)
		await writeTextFile(
			`${localStorage.getItem('documents-path')}/players/autoexec.cfg`,
			ans.join('\n')
		)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 flex'>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='font-paragraph font-medium'>
								Player name
							</FormLabel>
							<FormControl>
								<div className='flex gap-2'>
									<Input
										className='font-mono'
										placeholder={
											localStorage.getItem('player-name') ?? 'camper_on_YT'
										}
										{...field}
									/>
									<Button variant='outline' className='w-9' type='submit'>
										<Check />
									</Button>
								</div>
							</FormControl>
							<FormMessage className='absolute' />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
