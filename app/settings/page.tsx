"use client"

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {toast} from "@/hooks/use-toast";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {exists, BaseDirectory, readTextFileLines, writeTextFile} from "@tauri-apps/plugin-fs"
import {Button} from "@/components/ui/button";
import {documentDir} from "@tauri-apps/api/path";
import {ArrowBigLeft} from "lucide-react";
import Link from "next/link";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

const Page = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const name = JSON.stringify(data, null, 2)
        const parsedData = JSON.parse(name);

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{name}</code>
        </pre>
            ),
        })

        const writeToFile = async () => {
            const docsDir = await documentDir();
            const configPath = await exists(`${docsDir}/Call of Duty Modern Warfare/players/autoexec.cfg`);

            if (!configPath) {
                console.log("NO");
            } else {
                console.log("YES");

                const lines = await readTextFileLines('Call of Duty Modern Warfare/players/autoexec.cfg', { baseDir: BaseDirectory.Document });

                let iteration = 0;
                let newContent = "";  // Collect the content to write here

                for await (const line of lines) {
                    iteration += 1;

                    console.log(iteration);
                    console.log(line);

                    if (iteration == 2) {
                        newContent += `player_name ${parsedData.username}\n`;
                    } else {
                        newContent += line + "\n";
                    }
                }

                // Write the new content to the file after the loop finishes
                await writeTextFile('Call of Duty Modern Warfare/players/autoexec.cfg', newContent, { baseDir: BaseDirectory.Document });
            }
        }


        await writeToFile()
    }

    return (
        <div>
            <main className="select-none font-inter min-h-screen p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-row items-center mb-6">
                        <h1 className="text-2xl font-bold">Launcher Settings</h1>
                    </div>
                    <div className="flex ml-auto gap-1 mb-3 mt-7">
                        <Link href="/">
                            <Button variant="outline"><ArrowBigLeft className="h-4 w-4"/>Back to the launcher</Button>
                        </Link>
                    </div>
                    <div className="space-y-6 mt-6">

                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📁 Autoexec</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Player Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="your_name" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your ingame display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Page;