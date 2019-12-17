'use strict';

const electron = require('electron');

class Notificator {
    constructor(player) {
        this.player = player;
    }

    build() {
        this.subscribeEvents();
    }

    subscribeEvents() {
        this.player.on('EVENT_TRACK', () => {
            const track = this.player.currentTrack();
            const artists = track.artists.map((item) => {
                return item.title;
            }).join(', ');

            const coverUrl = 'https://' + track.album.cover.replace('%%', '50x50');

            const notification = new electron.Notification({
                title: track.title,
                subtitle: artists,
                icon: coverUrl,
                silent: true,
            });

            notification.show();
        });
    }
}

module.exports.Notificator = Notificator;
