"use strict"
// index.jsIts job is to just create electron app nothing more

const electron = require("electron");

// The app is overall running electron process main process
// every other process is to be created by us.

//Life cycle
// Electron Start a app.
// App process is created it takes time and need to boot up wait for it to process
// as and when ready listen for ready event
// 


//  "start": "electron ."
//  . place for current directory and looks for index.js by default
const { app, BrowserWindow } = electron;
//event based programming...
// by default it just start app
// we need to make windows and put content to display there.
// To quit either quit from top left of process.
//  or ctrl + c
app.on('ready', ()=>{
    console.log("App is now ready");
    /**
     *      Electron App (index.js=> creates browser window)
     *            |
     *            |
     *      Main Window (seprate process running on machine we will learn to communicate.)
     */
    //  To show some content in app as browser window we need to pull object BrowerWindow from electron
    //  After app is ready we create a window and pass it configurations {}.
    //  just calling brower window here we automatically startup a new brower window on desktop
    //  It is main window in our application
    // This launces a real browser window to see go to view-> toggle developer tools. The chromimum dev window.
    // browser window is going to load some HTML document, use dev tools as normal, it doenot interact with codebase but hust runnig app
    // See no html loaded into it
    // create a index.html
    //  we need to tell about main window
    const mainWindow = new BrowserWindow({});
    // This need to load a valid url. as html document or server a web page
    // mainWindow.loadURL("https://google.com");
    mainWindow.loadURL(`file://${ __dirname+'/index.html' }`)
});