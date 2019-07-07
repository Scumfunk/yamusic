'use strict';

const { globalShortcut } = require('electron');

// Manages all the system shortcuts

class ShortcutManager {
    constructor(player){
        this.player = player;
    }

    registerEvents = () => {
        const bindings = {
            'MediaPlayPause': this.player.play,
            'MediaNextTrack': this.player.next,
            'MediaPreviousTrack': this.player.prev
        }

        for (let key in bindings) {
            let ret = globalShortcut.register(key, bindings[key]);
            if (!ret) {
                console.log('Error binding key')
                return;
            }
        }
    }
}

module.exports.ShortcutManager = ShortcutManager