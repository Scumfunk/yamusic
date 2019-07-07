'use strict';

const EventEmmiter = require('events')
const { ipcMain } = require('electron');

// This class is Yandex external API integration point. It provides sync interface to control player and events emitting on API changes.

class Player extends EventEmmiter {
    constructor(window){
        super()
        this.window = window
        this.state = {}

        ipcMain.on('EVENT_READY', (event, arg) => {
            this.emit('EVENT_READY')
        })

        ipcMain.on('EVENT_TRACK', (event, arg) => {
            this.window.webContents.executeJavaScript('externalAPI.getCurrentTrack();')
                .then((track) => {
                    this.state.track = track
                    this.emit('EVENT_TRACK')
                })
        })

        ipcMain.on('EVENT_STATE', (event, arg) => {
            this.window.webContents.executeJavaScript('externalAPI.isPlaying();')
                .then((status) => {
                    this.state.isPlaying = status
                    this.emit('EVENT_STATE')
                })
        })

        ipcMain.on('EVENT_CONTROLS', (event, arg) => {
            this.window.webContents.executeJavaScript('externalAPI.getControls();')
                .then( (controls) => {
                    this.state.controls = controls
                    this.emit('EVENT_CONTROLS')
                })
        })

        ipcMain.on('EVENT_PROGRESS', (event, arg) => {
            this.window.webContents.executeJavaScript('externalAPI.getProgress();')
                .then( (progress) => {
                    this.state.progress = progress
                    this.emit('EVENT_PROGRESS')
                })
        })

        ipcMain.on('EVENT_ADVERT', (event, arg) => {
            this.state.advert = arg
            this.emit('EVENT_ADVERT')
        })
    }

    // Controls

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
        this.state.track.liked = !this.state.track.liked
        this.emit('EVENT_TRACK')
    }

    setPosition = (position) => {
        this.window.webContents.executeJavaScript('externalAPI.setPosition('+ position +');').catch(()=>{console.log('Some problems with setting position')})
    }

    // Info methods

    canPlay = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.play
    }

    isPlaying = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.isPlaying
    }

    canNext = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.next
    }

    canPrev = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.prev
    }

    canLike = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.like && !this.state.currentTrack.liked
    }

    isCurrentTrackLiked = () => {
        return !this.state.adverb && this.state.track && this.state.track.liked
    }

    getCoverLink = (size = '30x30') => {
        return this.state.track.cover.replace('%%', size)
    }

    currentTrack = () => {
        return this.state.track
    }

    controls = () => {
        return this.state.controls
    }
}

module.exports.Player = Player