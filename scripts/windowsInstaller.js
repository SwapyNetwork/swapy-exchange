const electronInstaller = require('electron-winstaller');
const path = require('path');

resultPromise = electronInstaller.createWindowsInstaller({
  name: 'swapy-alpha',
  appDirectory: path.join(__dirname, '../installers/swapy-exchange-alpha-win32-x64'),
  outputDirectory:  path.join('C:\\s\\'),
  authors: 'Swapy Network',
  exe: 'swapy-alpha.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${ e.message }`));