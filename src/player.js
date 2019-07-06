'use strict';

class Player {
    constructor(window){
        this.window = window;
    }

    play = () => {
        this.window.webContents.executeJavaScript('externalAPI.togglePause();').catch(()=>{console.log('Some problems with play')})
    }

    next = () => {
        this.window.webContents.executeJavaScript('externalAPI.next();').catch(()=>{console.log('Some problems with next')})
    }

    prev = () => {
        this.window.webContents.executeJavaScript('externalAPI.prev();').catch(()=>{console.log('Some problems with prev')})
    }

    like = () => {
        this.window.webContents.executeJavaScript('externalAPI.toggleLike();').catch(()=>{console.log('Some problems with like')})
    }

    currentTrack = () => {
        return this.window.webContents.executeJavaScript('externalAPI.getCurrentTrack();')
    }

    isPlaying = () => {
        return this.window.webContents.executeJavaScript('externalAPI.isPlaying();')
    }

    controls = () => {
        return this.window.webContents.executeJavaScript('externalAPI.getControls();')
    }
}

module.exports.Player = Player