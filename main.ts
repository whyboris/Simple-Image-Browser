import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';
const electron = require('electron');

const windowStateKeeper = require('electron-window-state');

import { fdir } from 'fdir';

import { AllowedExtension, ImageFile } from './src/app/home/home.component';

import { AllSettings } from './src/interfaces/settings-object.interface';

const fs = require('fs');
const pathToAppData = path.join(app.getPath('appData'), 'simple-image-browser');

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

electron.Menu.setApplicationMenu(null);

function createWindow(): BrowserWindow {

  const mainWindowState = windowStateKeeper({
    defaultWidth: 850,
    defaultHeight: 850
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 420,
    minHeight: 250,
    center: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      // allowRunningInsecureContent: (serve) ? true : false,
      allowRunningInsecureContent: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
      webSecurity: false
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });
  });

} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('just-started', (event) => {

  console.log('just started');
  console.log(pathToAppData);

  fs.readFile(path.join(pathToAppData, 'settings.json'), (err, data) => {
    if (!err) {
      try {
        const previouslySavedSettings: AllSettings = JSON.parse(data);
        event.sender.send('settings-returning', previouslySavedSettings);
      } catch (err) {
        // error parsing
      }
    }
  });
});

ipcMain.on('close', (event, settings: AllSettings) => {

  const json = JSON.stringify(settings);

  try {
    fs.statSync(pathToAppData);
  } catch (e) {
    fs.mkdirSync(pathToAppData);
  }

  fs.writeFile(path.join(pathToAppData, 'settings.json'), json, 'utf8', () => {
    app.exit();
  });
});

ipcMain.on('maximize', (event) => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().maximize();
  }
});

ipcMain.on('full-screen-status', (event, flag: boolean) => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().setFullScreen(flag);
  }
});

ipcMain.on('un-maximize', (event) => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().unmaximize();
  }
});

ipcMain.on('minimize', (event) => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().minimize();
  }
});


ipcMain.on('choose-input', (event) => {
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }).then(result => {
    const inputDirPath: string = result.filePaths[0];
    if (inputDirPath) {
      event.sender.send('input-folder-chosen', inputDirPath);

      superFastSystemScan(inputDirPath, event);

    }
  }).catch(err => {});
});

const acceptableFiles: AllowedExtension[] = ['jpg', 'png', 'jpeg'];

let allFiles = [];

/**
 * Use `fdir` to quickly generate file list and add it to `metadataQueue`
 * @param inputDir    -- full path to the input folder
 */
function superFastSystemScan(inputDir: string, event): void {

  allFiles = [];

  const crawler = new fdir().withFullPaths().crawl(inputDir);

  crawler.withPromise().then((files: any) => {

    // LOGGING =====================================================================================
    console.log('Found ', files.length, ' files in given directory');
    // =============================================================================================

    files.forEach((fullPath: string) => {

      const parsed = path.parse(fullPath);

      if (!acceptableFiles.includes(parsed.ext.substr(1).toLowerCase() as AllowedExtension)) {
        return;
      }

      const partial: string = path.relative(inputDir, parsed.dir).replace(/\\/g, '/');

      const newItem: ImageFile = {
        extension: parsed.ext.replace('.', '') as AllowedExtension,
        fullPath: fullPath,
        name: parsed.base.replace(parsed.ext, ''),
        partialPath: '/' + partial,
      }

      allFiles.push(newItem);

    });

    // console.log(allFiles);

    event.sender.send('files-coming-back', allFiles);

  });

}
