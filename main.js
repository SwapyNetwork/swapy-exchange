const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();



if(isDev) {
  require('electron-reload')(path.join(__dirname));
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, icon: 'assets/swapy3.png' });
  const fs = require('fs');

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file',
    slashes: true
  }));

  if(isDev) {
    // Open the DevTools.
    win.webContents.openDevTools();
  }
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

const ipc = require('electron').ipcMain;
const Store = require('electron-store');
const sha1 = require('sha1');
// const walletFile = fs.readFileSync(app.getPath('userData') + '/' + 'data' + '.json', 'utf-8');
// console.log(walletFile);

function createElectronStore(fileName){
  const file = fs.readFileSync('./env.json', 'utf-8');
  const secret = JSON.parse(file.toString('utf8')).STORE_SECRET;
  const store = new Store({ 'name': fileName, 'encryptionKey': secret });
  return store;;
}

ipc.on('create-wallet', function (event, data) {
  const store = createElectronStore(sha1(data.user));
  store.set('address', data.address);
  store.set('privateKey', data.privateKey);
});

ipc.on('get-wallet', function (event, data) {
  if(fs.existsSync(app.getPath('userData') + '/' + sha1(data) + '.json', 'utf-8')){
    const store = createElectronStore(sha1(data));
    const address = store.get('address');
    const privateKey = store.get('privateKey');
    event.returnValue = { address, privateKey };
  } else {
    event.returnValue = false;
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
