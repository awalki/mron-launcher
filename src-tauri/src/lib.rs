use std::env;
use std::fs::{self, File};
use std::io::{self, copy};
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager, Runtime};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .invoke_handler(tauri::generate_handler![extract_zip, launch_second_app])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn extract_zip<R: Runtime>(
    app: AppHandle<R>,
    zip_path: String,
    extract_path: Option<String>,
) -> Result<Vec<String>, String> {
    let file = File::open(&zip_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    // Use the app's resource directory if no extract path is provided
    let base_extract_path = if let Some(path) = extract_path {
        PathBuf::from(path)
    } else {
        app.path()
            .app_local_data_dir()
            .unwrap_or(PathBuf::from("./extracted"))
    };

    let mut extracted_files = Vec::new();

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = match file.enclosed_name() {
            Some(path) => base_extract_path.join(path),
            None => continue,
        };

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p).map_err(|e| e.to_string())?;
                }
            }
            let mut outfile = File::create(&outpath).map_err(|e| e.to_string())?;
            copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;

            extracted_files.push(outpath.to_string_lossy().to_string());
        }

        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode))
                    .map_err(|e| e.to_string())?;
            }
        }
    }

    Ok(extracted_files)
}

#[tauri::command]
async fn launch_second_app<R: Runtime>(
    app: AppHandle<R>,
    exe_path: String,
) -> Result<(), String> {
    let exe_path = PathBuf::from(&exe_path);

    println!("Attempting to launch executable at: {}", exe_path.display());

    if !exe_path.exists() {
        return Err(format!("Executable not found at: {}", exe_path.display()));
    }

    // Change the current directory to the directory of the executable
    if let Some(parent) = exe_path.parent() {
        env::set_current_dir(parent).map_err(|e| e.to_string())?;
    }

    // Launch the executable using the shell plugin
    let command = app.shell().command(&exe_path);

    let (mut rx, _child) = command.spawn().map_err(|e| e.to_string())?;

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    println!("Second app output: {}", String::from_utf8_lossy(&line));
                },
                CommandEvent::Stderr(line) => {
                    eprintln!("Second app error: {}", String::from_utf8_lossy(&line));
                },
                _ => {}
            }
        }
    });

    Ok(())
}

