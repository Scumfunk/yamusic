'use strict';

const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { Player } = require('./src/player');
const { YTouchBar } = require('./src/yTouchBar');
const { ShortcutManager } = require('./src/shortcutManager');

let win = null;

app.on('ready', () => {
    win = new BrowserWindow(
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
    player.on('EVENT_READY', () => {
        if (process.env.NODE_ENV !== 'test') {
            win.setTouchBar(touchBar.build());
            shortcuts.bindKeys(win);
        }
    });

    win.loadURL('https://music.yandex.ru');

    win.on('close', (event) => {
        if (app.quitting) {
            win = null;
        } else {
            event.preventDefault();
            win.hide();
        }
    });

    win.on('ready-to-show', () => {
        win.show();
        win.focus();
    });


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    win.show();
});

app.on('before-quit', () => app.quitting = true);
