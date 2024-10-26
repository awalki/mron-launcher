"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {Box, FolderOpen, Play, Info, Wrench, Settings} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { open as openFile } from "@tauri-apps/plugin-fs"
import { open as openLink } from "@tauri-apps/plugin-shell";
import { relaunch } from '@tauri-apps/plugin-process';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { open } from '@tauri-apps/plugin-dialog';
import { download } from '@tauri-apps/plugin-upload';
import { fetch } from '@tauri-apps/plugin-http';
import { mkdir, exists, remove, writeFile, readTextFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { documentDir, appLocalDataDir } from '@tauri-apps/api/path';
import Link from "next/link";

export default function Home() {
  const { toast } = useToast();
  const [needsFolderSelection, setNeedsFolderSelection] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [progress, setProgress] = useState(0);
  const [installationComplete, setInstallationComplete] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPlayable, setIsPlayable] = useState(false);
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false);

  useEffect(() => {
    const handleContextMenu = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const checkExistingInstallation = async () => {
      const appDataPath = await appLocalDataDir();
      const gamePathFile = `${appDataPath}/game_path.txt`;
      console.log(isInstalling)
      console.log(isPlayable)

      if (await exists(gamePathFile)) {
        const path = await readTextFile(gamePathFile);
        setSelectedFolder(path);
        setNeedsFolderSelection(false);
        await checkForConfig();

        setInstallationComplete(true);
      }
    };

    setIsClient(true);
    checkExistingInstallation();
  }, []);

  const toDocumentsUrl = "https://gist.githubusercontent.com/awalki/69842b321c1170ca85b7d11e14421ec6/raw/806368533af8123bdbd87db0b45b29b1a7ecc57d/gistfile1.json";
  const defaultAutoExecUrl = "https://gist.githubusercontent.com/awalki/7b64f66ceef6e2f5e1c895b286cd965b/raw/f54217ea73e77be311373f611331c2275a5b69bc/gistfile1.json";
  const toGameFolderUrl = "https://gist.githubusercontent.com/awalki/2094fe707c7e6fb5c7db804b8d38fa00/raw/1a99bb0d6d48d20d1905ea6e26c71d6eb6595cc8/gistfile1.json";

  async function makeResponse(url: string) {
    if (!fetch) return null;
    try {
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      return data.url;
    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
      return null;
    }
  }

  async function downloadArchive(url: string, outputPath: string) {
    if (!download) return;
    try {
      await download(url, outputPath);
      setProgress(prev => prev + 33);
    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
    }
  }

  const handleFolderSelection = async () => {
    if (!open) return;
    try {
      const file = await open({ multiple: false, directory: true });
      if (file) {
        setSelectedFolder(file as string);
        setNeedsFolderSelection(false);
      } else {
        toast({ variant: "destructive", title: "No folder selected", description: "Please select a folder" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
    }
  };

  async function extractZip(zipPath: string, extractPath?: string) {
    if (!invoke) return;
    try {
      await invoke('extract_zip', { zipPath, extractPath });
      setProgress(prev => prev + 33);
    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
    }
  }

  const handleSite = async() => {
    await openLink("https://www.mronwarzone.ru/verdansk")
  }
  const handleDiscord = async() => {
    await openLink("https://discord.gg/mronwarzone")
  }

  const handleInstallation = async () => {
    setIsInstalling(true);
    const documentPath = await documentDir();
    const appDataPath = await appLocalDataDir();

    const cachePath = `${appDataPath}/cache`;

    try {
      await mkdir(cachePath);
    } catch (error) {
      console.log("Error creating cache directory:", error);
    }

    try {
      const [toDocuments, toGameFolder, defaultConfig] = await Promise.all([
        makeResponse(toDocumentsUrl),
        makeResponse(toGameFolderUrl),
        makeResponse(defaultAutoExecUrl)
      ]);

      if (toDocuments) await downloadArchive(toDocuments, `${cachePath}/toDocuments.zip`);
      if (toGameFolder) await downloadArchive(toGameFolder, `${cachePath}/toGameFolder.zip`);
      if (defaultConfig) await downloadArchive(defaultConfig, `${cachePath}/defaultConfig.zip`);

      await extractZip(`${cachePath}/toGameFolder.zip`, `${selectedFolder}/`);
      await extractZip(`${cachePath}/toDocuments.zip`, `${documentPath}/Call of Duty Modern Warfare/`);

      if (!await exists(`${documentPath}/Call of Duty Modern Warfare/players/autoexec.cfg`)) {
        await extractZip(`${cachePath}/defaultConfig.zip`, `${documentPath}/Call of Duty Modern Warfare/`);
      }

      await checkForConfig();

      console.log("Installation completed successfully!");
      setInstallationComplete(true);
      setProgress(100);

      const gamePathFile = `${appDataPath}/game_path.txt`;

      if (selectedFolder) {
        const encoder = new TextEncoder();
        const data = encoder.encode(selectedFolder);
        await writeFile(gamePathFile, data);
        setIsPlayable(true);
      } else {
        toast({ variant: "destructive", title: "Folder not selected", description: "Please select a folder first." });
      }

    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
    } finally {
      setIsInstalling(false);
    }
  };

  const checkForConfig = async () => {
    const localData = await appLocalDataDir();
    const configFilePath = `${localData}/game_path.txt`;

    try {
      const file = await openFile(configFilePath, {
        read: true
      });

      const buf = new Uint8Array();

      const bytesRead = await file.read(buf);

      if (bytesRead === null) {
        throw new Error("No bytes read from the file.");
      }

      const textContents = new TextDecoder().decode(buf.subarray(0, bytesRead));

      await file.close();

      return textContents.trim();
    } catch (error) {
      console.error("Error reading the config file:", error);
      return null;
    }
  };

  async function launchSecondApp() {
    const exePathFromConfig = await checkForConfig();
    const exePathFromSelected = `${selectedFolder}/game_dx12_ship_replay.exe`;

    try {
      const exePath = exePathFromConfig
        ? `${exePathFromConfig}/game_dx12_ship_replay.exe`
        : exePathFromSelected;

      const result = await invoke('launch_second_app', { exePath });
      console.log('Successfully launched second app:', result);
    } catch (error) {
      console.error('Failed to launch second app:', error);
    }
  }

  const handlePlay = async () => {
    if (!selectedFolder) {
      toast({ variant: "destructive", title: "Folder not selected", description: "Please select a folder first." });
      return;
    }

    try {

      await launchSecondApp()

    } catch (error) {
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: String(error) });
    }
  };






  useEffect(() => {
    const checkExistingInstallation = async () => {
      const appDataPath = await appLocalDataDir();
      const gamePathFile = `${appDataPath}/game_path.txt`;

      if (await exists(gamePathFile)) {
        const path = await readTextFile(gamePathFile);
        setSelectedFolder(path);
        setNeedsFolderSelection(false);
        await checkForConfig();

        setInstallationComplete(true);
      }
    };

    setIsClient(true);
    checkExistingInstallation();
  }, []);

  const handleCacheClear = async () => {
    setClearCacheDialogOpen(true);
  };

  const confirmCacheClear = async () => {
    try {
      const appDataPath = await appLocalDataDir();
      await remove(`${appDataPath}/cache`, { recursive: true });
      await remove(`${appDataPath}/game_path.txt`);
      await relaunch();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cache not found or game folder not specified"
      });
    } finally {
      setClearCacheDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setNeedsFolderSelection(true);
    setSelectedFolder(null);
    setProgress(0);
    setInstallationComplete(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="select-none font-inter min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-row items-center mb-6">
          <h1 className="text-2xl font-bold">MRON Launcher</h1>

          <div className="flex ml-auto gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Info</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSite}>Our Website</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDiscord}>Our Discord</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="settings">
              <Button variant="outline" size="icon"><Settings className="h-4 w-4"/></Button>
            </Link>
          </div>
        </div>
        <div className="space-y-6">

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>⏳ Installation Progress</CardTitle>
              <CardDescription>{installationComplete ? "Installation Complete!" : `${progress}% Complete`}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>📖 Read before install</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="hover:no-underline">Can&#39;t install?</AccordionTrigger>
                  <AccordionContent>
                    Make sure that there is no Cyrillic characters on the game path and you have specified the correct folder, if you have specified the wrong one click “Clear Cache” button
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="hover:no-underline">Connection error when try to install?</AccordionTrigger>
                  <AccordionContent>
                    More likely you have a regional lockdown or the server is down at the moment
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="hover:no-underline">The game doesn&#39;t launch after pressing Play?</AccordionTrigger>
                  <AccordionContent>
                    Make sure there is: game_dx12_ship_replay.exe in the game folder and the path names are in Latin characters
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <AlertDialog open={clearCacheDialogOpen} onOpenChange={setClearCacheDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-1/2 mr-3" onClick={handleCacheClear}>
                <Wrench className="mr-2 h-4 w-4" /> Repair launcher
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Repair?</AlertDialogTitle>
                <AlertDialogDescription>
                  The program will be restarted after pressing OK.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setClearCacheDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCacheClear}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {needsFolderSelection ? (
            <Button
              onClick={handleFolderSelection}
              className="w-1/2 bg-yellow-300 hover:bg-yellow-400"
            >
              <FolderOpen className="mr-2 h-4 w-4" /> Select Folder
            </Button>
          ) : installationComplete ? (
            <Button
              onClick={handlePlay}
              className={`w-1/2 bg-green-500 hover:bg-green-600`}
            >
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-1/2 bg-yellow-300 hover:bg-yellow-400"
                >
                  <Box className="mr-2 h-4 w-4" /> Install
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Installation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to start the installation process? This will install MRON
                    in <strong>{selectedFolder}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleInstallation}>Install</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </main>
  );
}