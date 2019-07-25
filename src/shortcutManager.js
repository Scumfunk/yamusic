'use strict';

const { globalShortcut, dialog } = require('electron');

// Manages all the system shortcuts

class ShortcutManager {
    constructor(player) {
        this.player = player;
        this.shouldBind = true;
    }

    bindKeys(){
        let counter = 0;
        let reg = this.registerEvents();
        while (this.shouldBind && !reg && counter < 5) {
            dialog.showMessageBox({
                type: 'warning',
                buttons: ['Try again', 'It doesn`t matter'],
                title: 'Cannot bing OS shortcuts',
                'message': 'Cant bind global shortcut'
            },
            (response) => {
                switch (response) {
                case 1:
                    this.shouldBind = false;
                    break;
                case 0:
                    reg = this.registerEvents();
                    break;
                }
            });
            counter += 1;
        }
    }

    registerEvents() {
        const bindings = {
            'MediaPlayPause': this.player.play,
            'MediaNextTrack': this.player.next,
            'MediaPreviousTrack': this.player.prev,
        };

        let res = true;

        for (let key in bindings) {
            res = res && globalShortcut.register(key, bindings[key]);
        }

        return res;
    }
}

module.exports.ShortcutManager = ShortcutManager;
