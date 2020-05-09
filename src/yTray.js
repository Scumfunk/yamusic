'use strict'

const { Menu, Tray } = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const process = require('process');

class YTray {
	constructor(player) {
		this.player = player;

        this.images = {
            icon: nativeImage.createFromPath(path.join(process.resourcesPath, 'icons', 'icon.png'))
        };

		this.tray = new Tray(this.images.icon);
		this.trayContextMenuTemplate = [
			{
				label: 'Play', 
				click: this.player.play 
			},
			{
				label: 'Previous', 
				click: this.player.prev 
			},
			{ 
				label: 'Next', 
				click: this.player.next 
			},
			{
				label: 'Like',
				click: this.player.like
			}, 
			{
				type: 'separator'
			},
			{
				label: 'Nothing play right now'
			}
		];
		this.contextMenu = Menu.buildFromTemplate(this.trayContextMenuTemplate);
		this.tray.setContextMenu(this.contextMenu);

		this.subscribeEvents();
	}

	subscribeEvents() {
        this.player.on('EVENT_TRACK', () => {
            const track = this.player.currentTrack();
            const artists = track.artists.map((item) => {
                return item.title;
            }).join(', ');

			this.trayContextMenuTemplate[0].label = this.player.isPlaying() ? 'Pause' : 'Play';
			this.trayContextMenuTemplate[3].label = this.player.isCurrentTrackLiked() ? 'Unlike' : 'Like';            
            this.trayContextMenuTemplate[5].label = [artists, track.title].join(' - ');
            this.contextMenu = Menu.buildFromTemplate(this.trayContextMenuTemplate);
            this.tray.setContextMenu(this.contextMenu);
        });

        this.player.on('EVENT_STATE', () => {
			this.trayContextMenuTemplate[0].label = this.player.isPlaying() ? 'Pause' : 'Play';  
            this.contextMenu = Menu.buildFromTemplate(this.trayContextMenuTemplate);
            this.tray.setContextMenu(this.contextMenu);
        });
	}
}

module.exports.YTray = YTray;