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

        this.subscribeEvents()
        
        return this.touchBar
    }

    subscribeEvents(){
        this.player.on('EVENT_TRACK', () => {
            let track = this.player.currentTrack()
            let artists = track.artists.map((item) => {return item.title}).join(', ')
            this.trackLabel.label = [artists, track.title].join(' - ')
            this.likeButton.backgroundColor = this.player.isCurrentTrackLiked() ? this.colors.likeButton : this.colors.secondButton
        })

        this.player.on('EVENT_STATE', () => {
            this.playButton.icon = this.player.isPlaying() ? this.images.pause : this.images.play
        })

        this.player.on('EVENT_CONTROLS', () => {
            this.prevButton.backgroundColor = this.player.canPrev() ? this.colors.mainButton : this.colors.secondButton
            this.nextButton.backgroundColor = this.player.canNext() ? this.colors.mainButton : this.colors.secondButton
        })
    }
}

module.exports.YTouchBar = YTouchBar