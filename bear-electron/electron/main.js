
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log; autoUpdater.logger.transports.file.level = 'info';

function createWindow(){
  const win = new BrowserWindow({
    width:1200, height:800,
    webPreferences: {
      preload: path.join(__dirname,'..','preload','preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname,'..','renderer','index.html'));
  if(isDev) win.webContents.openDevTools();
  win.once('ready-to-show', ()=> { if(!isDev) autoUpdater.checkForUpdatesAndNotify(); });
}

autoUpdater.on('update-downloaded', ()=> {
  dialog.showMessageBox({ type:'info', title:'Atualização', message:'Nova atualização disponível. Reiniciando para aplicar.' })
    .then(()=> autoUpdater.quitAndInstall());
});

app.whenReady().then(createWindow);
app.on('window-all-closed', ()=> { if(process.platform !== 'darwin') app.quit(); });
require('./services/ipc_handlers');
