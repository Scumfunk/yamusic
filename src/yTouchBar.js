'use strict';

const { TouchBar } = require('electron');
const { TouchBarButton, TouchBarSpacer, TouchBarLabel } = TouchBar
const nativeImage = require('electron').nativeImage

class YTouchBar {
    constructor(player){
        this.player = player;

        this.images = {
            play: nativeImage.createFromNamedImage('NSTouchBarPlayTemplate', [-1, 0, 1]),
            pause: nativeImage.createFromNamedImage('NSPauseTemplate', [-1, 0, 1]),
            prev: nativeImage.createFromNamedImage('NSTouchBarSkipToStartTemplate', [-1, 0, 1]),
            next: nativeImage.createFromNamedImage('NSTouchBarSkipToEndTemplate', [-1, 0, 1])
        }
    }

    make = () => {
        this.playButton = new TouchBarButton({
            icon: this.images.play,
            backgroundColor: '#7851A9',
            click: this.player.play
        })

        this.prevButton = new TouchBarButton({
            icon: this.images.prev,
            backgroundColor: '#7851A9',
            click: this.player.prev
        })

        this.nextButton = new TouchBarButton({
            icon: this.images.next,
            backgroundColor: '#7851A9',
            click: this.player.next
        })

        this.trackLabel = new TouchBarLabel({
            label: '',
        })

        this.touchBar = new TouchBar({
            items: [
                this.playButton,
                new TouchBarSpacer({ size: 'small' }),
                this.prevButton,
                new TouchBarSpacer({ size: 'small' }),
                this.trackLabel,
                new TouchBarSpacer({ size: 'snall' }),
                this.nextButton,
                new TouchBarSpacer({ size: 'large' })
            ]
        })
        
        return this.touchBar
    }

    updateTrackLabel = () => {
        this.player.currentTrack().then((track)=>{
            let artists = track.artists.map((item) => {return item.title}).join(', ')
            this.trackLabel.label = [artists, track.title].join(' - ')
        })
    }

    updatePlayingStatus = () => {
        this.player.isPlaying().then( (res) => { this.playButton.icon = res ? this.images.pause : this.images.play } )
    }

    updateControls = () => {
        this.player.controls().then( (res) => {
            this.prevButton.backgroundColor = res.prev ? '#7851A9' : '#777'
            this.nextButton.backgroundColor = res.next ? '#7851A9' : '#777'
        })
    }
}

module.exports.YTouchBar = YTouchBar