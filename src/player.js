"use strict";

const EventEmmiter = require('events');

// This class is Yandex external API integration point. It provides sync interface to control player and events emitting on changes.
// Has next events to subscribe:
// - EVENT_READY
// - EVENT_TRACK
// - EVENT_STATE
// - EVENT_CONTROLS
// - EVENT_PROGRESS
// - EVENT_ADVERT

class Player extends EventEmmiter {
    constructor(window, ipcMain) {
        super();
        this.window = window;
        this.ipcMain = ipcMain;
        this.state = {};

        this.ipcMain.on('EVENT_READY', () => {
            this.emit('EVENT_READY');
        });

        this.ipcMain.on('EVENT_TRACK', () => {
            this.window.webContents.executeJavaScript('externalAPI.getCurrentTrack();')
                .then((track) => {
                    this.state.track = track;
                    this.emit('EVENT_TRACK');
                });
        });

        this.ipcMain.on('EVENT_STATE', () => {
            this.window.webContents.executeJavaScript('externalAPI.isPlaying();')
                .then((status) => {
                    this.state.isPlaying = status;
                    this.emit('EVENT_STATE');
                });
        });

        this.ipcMain.on('EVENT_CONTROLS', () => {
            this.window.webContents.executeJavaScript('externalAPI.getControls();')
                .then( (controls) => {
                    this.state.controls = controls;
                    this.emit('EVENT_CONTROLS');
                });
        });

        this.ipcMain.on('EVENT_PROGRESS', () => {
            this.window.webContents.executeJavaScript('externalAPI.getProgress();')
                .then( (progress) => {
                    this.state.progress = progress;
                    this.emit('EVENT_PROGRESS');
                });
        });

        this.ipcMain.on('EVENT_ADVERT', (_, arg) => {
            this.state.advert = arg;
            this.emit('EVENT_ADVERT');
        });
    }

    // Controls

    play = () => {
        this.window.webContents.executeJavaScript('externalAPI.togglePause();')
            .catch(()=>{
                console.log('Some problems with play');
            });
    }

    next = () => {
        this.window.webContents.executeJavaScript('externalAPI.next();')
            .catch(()=>{
                console.log('Some problems with next');
            });
    }

    prev = () => {
        this.window.webContents.executeJavaScript('externalAPI.prev();')
            .catch(()=>{
                console.log('Some problems with prev');
            });
    }

    like = () => {
        this.window.webContents.executeJavaScript('externalAPI.toggleLike();')
            .catch(()=>{
                console.log('Some problems with like');
            });
        this.state.track.liked = !this.state.track.liked;
        this.emit('EVENT_TRACK');
    }

    setPosition = (position) => {
        this.window.webContents.executeJavaScript('externalAPI.setPosition('+ position +');')
            .catch(()=>{
                console.log('Some problems with setting position');
            });
    }

    //Info methods

    canPlay = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.play;
    }

    isPlaying = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.isPlaying;
    }

    canNext = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.next;
    }

    canPrev = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.prev;
    }

    canLike = () => {
        return !this.state.adverb && this.state.controls && this.state.controls.like && !this.state.currentTrack.liked;
    }

    isCurrentTrackLiked = () => {
        return !this.state.adverb && this.state.track && this.state.track.liked;
    }

    getCoverLink = (size = '30x30') => {
        return this.state.track.cover.replace('%%', size);
    }

    currentTrack = () => { 
        return this.state.track;
    }

    controls = () => {
        return this.state.controls;
    }
}

module.exports.Player = Player;
