'use strict';

const { TouchBar, ipcMain } = require('electron');
const { TouchBarButton, TouchBarSpacer, TouchBarLabel } = TouchBar
const nativeImage = require('electron').nativeImage

class YTouchBar {
    constructor(player){
        this.player = player;

        this.images = {
            play: nativeImage.createFromNamedImage('NSTouchBarPlayTemplate', [-1, 0, 1]),
            pause: nativeImage.createFromNamedImage('NSPauseTemplate', [-1, 0, 1]),
            prev: nativeImage.createFromNamedImage('NSTouchBarSkipToStartTemplate', [-1, 0, 1]),
            next: nativeImage.createFromNamedImage('NSTouchBarSkipToEndTemplate', [-1, 0, 1]),
            like: nativeImage.createFromNamedImage('NSTouchBarAddTemplate', [-1, 0, 1]),
        }

        this.colors = {
            mainButton: '#7851A9',
            playButton: '#78ccaa',
            likeButton: '#ff5555',
            secondButton: '#777'
        }
    }

    make = () => {
        ipcMain.on('EVENT_TRACK', (event, arg) => {
            this.updateTrackLabel()
        })

        ipcMain.on('EVENT_STATE', (event, arg) => {
            this.updatePlayingStatus()
        })

        ipcMain.on('EVENT_CONTROLS', (event, arg) => {
            this.updateControls()
        })

        this.playButton = new TouchBarButton({
            icon: this.images.play,
            backgroundColor: this.colors.playButton,
            click: this.player.play
        })

        this.prevButton = new TouchBarButton({
            icon: this.images.prev,
            backgroundColor: this.colors.mainButton,
            click: this.player.prev
        })

        this.nextButton = new TouchBarButton({
            icon: this.images.next,
            backgroundColor: this.colors.mainButton,
            click: this.player.next
        })

        this.likeButton = new TouchBarButton({
            icon: this.images.like,
            backgroundColor: this.colors.likeButton,
            click: this.player.like
        })

        this.trackLabel = new TouchBarLabel({
            label: '',
        })

        this.touchBar = new TouchBar({
            items: [
                this.playButton,
                this.prevButton,
                this.nextButton,
                this.likeButton,
                new TouchBarSpacer({ size: 'small' }),
                this.trackLabel,
                new TouchBarSpacer({ size: 'snall' }),
            ]
        })
        
        return this.touchBar
    }

    updateTrackLabel = () => {
        this.player.currentTrack()
            .then((track)=>{
                let artists = track.artists.map((item) => {return item.title}).join(', ')
                this.trackLabel.label = [artists, track.title].join(' - ')
                this.nextButton.backgroundColor = track.next ? this.colors.mainButton : this.colors.secondButton
            })
            .catch( ()=>{ console.log('Some problems with update track label') } )
    }

    updatePlayingStatus = () => {
        this.player.isPlaying()
            .then( (res) => { this.playButton.icon = res ? this.images.pause : this.images.play } )
            .catch( ()=>{ console.log('Some problems with update playing status') } )
    }

    updateControls = () => {
        this.player.controls()
            .then( (res) => {
                this.prevButton.backgroundColor = res.prev ? this.colors.mainButton : this.colors.secondButton
                this.nextButton.backgroundColor = res.next ? this.colors.mainButton : this.colors.secondButton
            })
            .catch( ()=>{ console.log('Some problems with update player controls') } )
        this.player.currentTrack()
            .then((track) => {
                this.likeButton.backgroundColor = track.liked ? this.colors.likeButton : this.colors.secondButton
            })
            .catch( ()=>{ console.log('Some problems with update like status') } )
    }
}

module.exports.YTouchBar = YTouchBar