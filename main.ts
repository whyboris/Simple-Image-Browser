import { app, BrowserWindow, screen, ipcMain, dialog, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { fdir } from 'fdir';
import { ImageFile } from './src/app/home/home.component';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
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
      const pathname = request.url.replace('file:///', '');
      callback(pathname);
    });
  });

} catch (e) {
  // Catch Error
  // throw e;
}

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

const acceptableFiles = ['jpg', 'png'];

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

      if (!acceptableFiles.includes(parsed.ext.substr(1).toLowerCase())) {
        return;
      }

      const partial: string = path.relative(inputDir, parsed.dir).replace(/\\/g, '/');

      const newItem: ImageFile = {
        fullPath: fullPath,
        name: parsed.base,
        partialPath: '/' + partial,
      }

      allFiles.push(newItem);

    });

    // console.log(allFiles);

    event.sender.send('files-coming-back', allFiles);

  });

}
