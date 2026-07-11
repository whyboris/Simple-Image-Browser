// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Serialize;
// use std::fs;
// use std::path::Path;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Serialize)]
pub struct FileOrDir {
    is_file: bool,
    is_directory: bool,
}

#[derive(Serialize)]
pub struct RustRenameResult {
    result: String,
    msg: String,
}

#[tauri::command]
fn rename() -> RustRenameResult {
    return RustRenameResult {
        result: "hi".to_string(),
        msg: "lol".to_string(),
    };
}

fn get_all_files(dir: &Path) -> Vec<PathBuf> {
    WalkDir::new(dir)
        .into_iter()
        .filter_map(|e| e.ok()) // Filter out permission/read errors
        .filter(|e| e.file_type().is_file()) // Filter out directories
        .map(|e| e.into_path()) // Convert DirEntry to PathBuf
        .collect() // Gather into a Vector
}

#[tauri::command]
fn get_file_list(pathstring: &str) -> Vec<PathBuf> {
    let path = Path::new(pathstring);
    let files = get_all_files(path);

    for file in &files {
        println!("{}", file.display());
    }

    return files;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![rename, get_file_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
