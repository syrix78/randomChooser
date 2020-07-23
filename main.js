const electron      	            = require('electron');
const app           	            = electron.app
const BrowserWindow 	= electron.BrowserWindow
 const path          	           = require('path')
const url           	           = require('url')
const {ipcMain}     	= require('electron'); // include the ipc module to communicate with render process ie to receive the message from render process
 // Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
	createWindow()
 }) 
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
	width : 400,
	height: 400,
	frame: true,
	webPreferences: {
    	webSecurity: false,
      plugins: true,
      nodeIntegration: true
	}
});
 // Open the DevTools.
 // mainWindow.webContents.openDevTools()
 
 // and load the index.html of the app.
  mainWindow.loadURL(url.format({
	pathname: path.join(__dirname, 'index.html'),
	protocol: 'file:',
	slashes: true
  }));
// Emitted when the window is closed.
  mainWindow.on('closed', function () {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null
  })
}
 app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
	createWindow()
  }
})
  // Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
	app.quit()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//ipcMain.on will receive the “btnclick” info from renderprocess 
ipcMain.on("btnclick",function (event, arg) {
console.log(arg);
 // inform the render process that the assigned task finished. Show a message in html
// event.sender.send in ipcMain will return the reply to renderprocess
 event.sender.send("btnclick-task-finished", arg); 
});