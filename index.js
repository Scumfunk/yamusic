'use strict';

const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { Player } = require('./src/player');
const { YTouchBar } = require('./src/yTouchBar');
const { ShortcutManager } = require('./src/shortcutManager');

app.on('ready', () => {
    let win = new BrowserWindow(
        {
            width: 1200, height: 800, webPreferences: {
                preload: path.join(__dirname, 'src/inject.js'),
                nodeIntegration: true,
                experimentalFeatures: true,

            },
        }
    );
    const player = new Player(win, ipcMain);
    const touchBar = new YTouchBar(player);
    const shortcuts = new ShortcutManager(player);
    win.on('closed', () => {
        win = null;
    });

    win.loadURL('https://music.yandex.ru');
    win.webContents.executeJavaScript('window.injectCallbacks()');

    player.on('EVENT_READY', () => {
        console.log(player);
        win.setTouchBar(touchBar.build());
        shortcuts.bindKeys(win);
        win.show();
        win.focus();
    });
});
