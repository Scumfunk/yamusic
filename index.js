'use strict';

const { app, BrowserWindow } = require('electron');
const { Player } = require('./src/player');
const { YTouchBar } = require('./src/yTouchBar');
const { ShortcutManager } = require('./src/shortcutManager');

app.on('ready', () => {
    let win = new BrowserWindow({ width: 800, height: 600 })
    let player = new Player(win)
    let touchBar = new YTouchBar(player)
    win.setTouchBar(touchBar.make())
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

        shortcuts.registerEvents(win)
    });
})
