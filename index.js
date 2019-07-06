'use strict';

const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron');
const { Player } = require('./src/player');
const { YTouchBar } = require('./src/yTouchBar');
const { ShortcutManager } = require('./src/shortcutManager');

app.on('ready', () => {
    let win = new BrowserWindow({ width: 800, height: 800, webPreferences: {preload: path.join(__dirname, 'src/inject.js')}})
    let player = new Player(win)
    let touchBar = new YTouchBar(player)
    let shortcuts = new ShortcutManager(player)

    win.on('closed', () => {
        win = null;
    });
    win.loadURL('https://music.yandex.ru')
    win.webContents.on('did-finish-load', () => {
        if (!win) {
          throw new Error('"mainWindow" is not defined');
        }
        win.show();
        win.focus();

        win.setTouchBar(touchBar.make())
        shortcuts.registerEvents(win)

        ipcMain.on('EVENT_TRACK', (event, arg) => {
            touchBar.updateTrackLabel()
        })

        ipcMain.on('EVENT_STATE', (event, arg) => {
            touchBar.updatePlayingStatus()
        })

        ipcMain.on('EVENT_CONTROLS', (event, arg) => {
            touchBar.updateControls()
        })

        win.webContents.executeJavaScript('window.injectCallbacks()')
    });
})
