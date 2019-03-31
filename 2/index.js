"use strict"

const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
// Top menu options are called labels, they dropdown to become submenu each of element in submenu is called a label itself
const operatingSystemPlatform  = process.platform;
const appENV = process.env.NODE_ENV;

let mainWindow;
let addTodoWindow;
// action of new todo click
function createAddWindow(){
    const windowOptions = {
        width: 300,
        height: 200,
        title: "Add new todo"
    };
    addTodoWindow = new BrowserWindow(windowOptions);
    addTodoWindow.loadURL(`file://${__dirname+'/addTodo.html'}`);

    addTodoWindow.on("closed", ()=>{
        console.log("closed ");
        addTodoWindow = null;
    });
}

ipcMain.on("todo:add", (event, data)=>{
    console.log("event todo:add fired by ipcRenderer is being ack by electron app...\n", event);
    mainWindow.webContents.send("todo:addSuccess", data);
    // addTodoWindow.close();
    // This is as such a bad practice and thus needs to be modified errase ref of window..
    addTodoWindow.close();
    // addTodoWindow = null; better add a event listener on closed..

});

//vscode menu labels top level are each one big objects
const fileSubmenu = [
    {
        label: 'New Todo',
        click: function(){
            createAddWindow();
        }
    }, 
    {
        label: 'Quit',
        // click property
        click: function(){
            app.quit();
        },
        //hot keys
        // accelerator: 'Command+Q',//osx gotcha
        accelerator: (()=>{
            if(operatingSystemPlatform === "darwin"){
                return "Command+Q";
            }
            else{
                return "Ctrl+Q";
            }
        })(),
        // accelerator: operatingSystemPlatform === "darwin" ? "Command+Q" : "Ctrl+Q"
    }
];
const menuTemplate = [
    // {
    //     //gotcha fixed for os but not a solution
    //     label: 'Electron'
    // },


    //file
    {
        label: 'File', //required property//
        submenu: fileSubmenu
    },
    // //edit
    // {

    // },
    // //selection
    // {

    // }
];

app.on('ready', (...agrs)=>{
    console.log("ready app", agrs);
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname+'/main.html'}`);

    // This holds refrence for your own build template
    // we build template ahead of time if it changes
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    // seting this mainMenu build by us as app mainMenu
    // as soon as we decide that we are using our menu the electron disable all of previous and this..gotcha...
    // It disables existing appliation menu it disable the cmd + R and all other defaults key binds,
    // for developement this needs to be done. to devtools also our menu???---w8

    // file label is not visible on osx, because it is expected that first should be application electron property.
    // fix os pass {} as first argument
    // check env variable maintained by node.js
    //process.platform "darwin" | "linux" | "window"

    // when app closedaddtodowindow not closed
    // listen on closed event on main winow quit app...

    mainWindow.on('closed', ()=>{
        app.quit();
    });

    
    Menu.setApplicationMenu(mainMenu);

});
if(operatingSystemPlatform==="darwin"){
    menuTemplate.unshift({
        label: 'Electron'
    });
}

if( appENV !=="production" ){
    menuTemplate.push({
        label: "DEVELOPER",
        submenu: [
            //behind scene electron matches reload to earlier reload options
            {
                role: "reload"
            },
            {
                label: "toggle dev tools",
                click: function(item, focusedWindow){
                    // console.log(item);
                    // console.log(focusedWindow);
                    focusedWindow.toggleDevTools();
                },
                accelerator: (()=>{
                    if(operatingSystemPlatform === "darwin"){
                        return "Command+Shift+I";
                    }
                    else{
                        return "Ctrl+Shift+I";
                    }
                })()
            }

        ]
    });
}