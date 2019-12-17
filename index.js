'use strict';

const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { Player } = require('./src/player');
const { YTouchBar } = require('./src/yTouchBar');
const { ShortcutManager } = require('./src/shortcutManager');
const { Notificator } = require('./src/notificator');

app.on('ready', () => {
    let win = new BrowserWindow(
        {
            width: 1200, height: 800,
            webPreferences: {
                preload: path.join(__dirname, 'src/inject.js'),
                nodeIntegration: true,
                experimentalFeatures: true,
                show: false,
                icon: path.join(__dirname, 'build/icon.png')
            },
        }
    );
    const player = new Player(win, ipcMain);
    const touchBar = new YTouchBar(player);
    const shortcuts = new ShortcutManager(player);
    const notificator = new Notificator(player);
    player.on('EVENT_READY', () => {
        if (process.env.NODE_ENV !== 'test') {
            win.setTouchBar(touchBar.build());
            shortcuts.bindKeys(win);
            notificator.build();
        }
    });

    win.loadURL('https://music.yandex.ru');

    win.on('closed', () => {
        win = null;
    });

    win.on('ready-to-show', () => {
        win.show();
        win.focus();
    });
});
