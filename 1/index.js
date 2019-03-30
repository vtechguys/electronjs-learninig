"use strict"
// index.jsIts job is to just create electron app nothing more

const electron = require("electron");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// const indexHTML_Path = path.join(__dirname, '/index.html'); 
// The app is overall running electron process main process
// every other process is to be created by us.

//Life cycle
// Electron Start a app.
// App process is created it takes time and need to boot up wait for it to process
// as and when ready listen for ready event
// 


//  "start": "electron ."
//  . place for current directory and looks for index.js by default
const { app, BrowserWindow, ipcMain } = electron;
//event based programming...
// by default it just start app
// we need to make windows and put content to display there.
// To quit either quit from top left of process.
//  or ctrl + c


let mainWindow;
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
    // const mainWindow = new BrowserWindow({});
    mainWindow = new BrowserWindow({});
    // This need to load a valid url. as html document or server a web page
    // mainWindow.loadURL("https://google.com");
    mainWindow.loadURL(`file://${ __dirname+'/index.html' }`)
    // command + R to reload.
    // markup change simple reload electron related retrart server.

    // we can get a file system access when user purposefully put file in webpage.
    // with elctron we can read any file we want to. It is electorn feature,
    // the form submit of its own like any web page form
    // write js in html to sumbit form... 
    // mainWindow.loadURL(`file://${indexHTML_Path}`);
    // place a debugger to pause exceution at debugger pt.
    //  in dev console select input tag and inspect its prperties .files

    // we will use ffmpeg library to deal with video files anything possible with this video file
    // ffmpeg is stand alone  cli tool to use it in node we intall fluent-ffmpeg wrapper
    /**
     *      user selects a file
     *              |
     *      feed the details to ffmpeg
     *              |
     *      ffmpeg does calculation
     *              |
     *      seconds...
     */

     // Os code -> elctron app instance
     // rest app based in webapp part - index.html
     // we have html webapp which need to communicate to electron app
     // electron does os video process then tell you back
     // this communication happens over ipc sytem
     // electron app <---> main window web app html
    
     // ipc is derived from electron itself and thus in webApp script we need a electron
    //  our electron desktop app -> main window has access to both browser  & node  

    // ipcRender sends event from main Window to electron app .send
    // ipcMain on ecectron app recive this event .on
    // some os level, cli processing
    // electron sends back the response to mainWindow as mainWindow.webcontents.send
    // ipcRender recives the success event, ipcRender.on
});
// first argument is event object to track which window sent the object. second+ agruments is our data
//  we have changed code on elctron side so start a electon process. again.
ipcMain.on('video:submit', (event, path)=>{
    ffmpeg.ffprobe(path, (error, metadata)=>{
        console.log("event", event);
        console.log("ffprobe=> video duration is", metadata);
        // mainWIdow was undefined so define it ahead of initialising it.
        mainWindow.webContents.send("video:fetchMetadata", metadata.format.duration);
    });
});