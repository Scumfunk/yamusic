'use strict';

const { TouchBar } = require('electron');
const { TouchBarButton, TouchBarSpacer, TouchBarLabel } = TouchBar

class YTouchBar {
    constructor(player){
        this.player = player;
    }

    make = () => {
        const playButton = new TouchBarButton({
            label: 'Play',
            backgroundColor: '#7851A9',
            click: () => {
                this.player.isPlaying().then( (res) => { playButton.label = res ? 'Play' : 'Pause' } )
                this.player.play();
            }
        })

        const nextButton = new TouchBarButton({
            label: 'Next',
            backgroundColor: '#ff4444',
            click: this.player.next
        })
        
        return new TouchBar({
            items: [
                playButton,
                new TouchBarSpacer({ size: 'large' }),
                nextButton,
                new TouchBarSpacer({ size: 'large' })
            ]
        })
    }
}

module.exports.YTouchBar = YTouchBar