'use strict';

class Player {
    constructor(window){
        this.window = window;
    }

    play = () => {
        this.window.webContents.executeJavaScript('externalAPI.togglePause();')
    }

    next = () => {
        this.window.webContents.executeJavaScript('externalAPI.next();')
    }

    prev = () => {
        this.window.webContents.executeJavaScript('externalAPI.prev();')
    }

    like = () => {
        this.window.webContents.executeJavaScript('externalAPI.toggleLike();')
    }

    currentTrack = () => {
        return this.window.webContents.executeJavaScript('externalAPI.getCurrentTrack();')
    }

    isPlaying = () => {
        return this.window.webContents.executeJavaScript('externalAPI.isPlaying();')
    }
}

module.exports.Player = Player