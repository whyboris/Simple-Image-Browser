# Simple Image Browser

Simple Image Browser is a simple way to browse your photos on your computer (Windows, Mac, Linux).

## Development

This project is a work in progress.

Main dependencies in use:

| Library          | Version | Date     |
| ---------------- | ------- | -------- |
| Angular          | v22     | Jun 2026 |
| Tauri            | v2.11.5 | Jun 2026 |

You will need to install `tauri` to develop and build this app. See [instructions](https://v2.tauri.app/start/prerequisites/)

Once you install `node` and `npm` just run `npm install`

After that `npm run dev` to develop & `npm run build` to build. `npm run tauri build -- --no-bundle` to build a portable version on _Windows_

## Notes

The original code started in 2021 as the [`angular-electron`](https://github.com/belnadris/angular-electron) boilerplate by [belnadris](https://github.com/belnadris). I got too busy with life stuff to work on it. _Electron_ build is >130mb while _Tauri_ is ~3mb, so in 2026 when I resumed coding this app, I switched to _Tauri_.

## Thank you

This software would not be possible without the tremendous work by other people. An incomplete list:

- [Tauri](https://github.com/tauri-apps/tauri)
- [Angular](https://github.com/angular/angular)
- [Quill](https://github.com/quilljs/quill)
