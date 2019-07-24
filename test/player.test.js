'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { Player } = require('../src/player');
const EventEmmiter = require('events');

describe('Player', function () {
    beforeEach(function () {
        this.spy = sinon.spy(
            function(){
                return new Promise(function(resolve) {
                    resolve('success');
                });
            }
        );
        let win = {
            webContents: {
                executeJavaScript: this.spy
            }
        };
        this.ipc = new EventEmmiter();
        this.player = new Player(win, this.ipc);
    });

    afterEach(function () {
        this.player = undefined;
        this.ipc = undefined;
        this.spy = undefined;
    });

    it('emits EVENT_READY', function () {
        this.player.on(
            'EVENT_READY',
            function() { assert(true); }
        );
        this.ipc.emit('EVENT_READY');
    });

    it('emits EVENT_TRACK and updates its state', function(){
        let player = this.player;
        this.player.on(
            'EVENT_TRACK',
            function() {
                assert.equal(player.state.track, 'success');
            }
        );
        this.ipc.emit('EVENT_TRACK');
    });

    it('emits EVENT_STATE and updates its state', function(){
        let player = this.player;
        this.player.on(
            'EVENT_STATE',
            function() {
                assert.equal(player.state.isPlaying, 'success');
            }
        );
        this.ipc.emit('EVENT_STATE');
    });

    it('emits EVENT_CONTROLS and updates its state', function(){
        let player = this.player;
        this.player.on(
            'EVENT_CONTROLS',
            function() {
                assert.equal(player.state.controls, 'success');
            }
        );
        this.ipc.emit('EVENT_CONTROLS');
    });

    it('emits EVENT_PROGRESS and updates its state', function(){
        let player = this.player;
        this.player.on(
            'EVENT_PROGRESS',
            function() {
                assert.equal(player.state.progress, 'success');
            }
        );
        this.ipc.emit('EVENT_PROGRESS');
    });

    it('emits EVENT_ADVERT and updates its state', function(){
        let player = this.player;
        this.player.on(
            'EVENT_ADVERT',
            function() {
                assert.equal(player.state.advert, 'success');
            }
        );
        this.ipc.emit('EVENT_ADVERT', null, 'success');
    });

    it('toggles play in external API', function(){
        this.player.play();
        assert(this.spy.calledWith('externalAPI.togglePause();'));
    });

    it('calls next in external API', function(){
        this.player.next();
        assert(this.spy.calledWith('externalAPI.next();'));
    });

    it('calls prev in external API', function(){
        this.player.prev();
        assert(this.spy.calledWith('externalAPI.prev();'));
    });

    it('toggles like in external API, updates its state', function(){
        this.ipc.emit('EVENT_TRACK');
        this.player.state = {
            track: {
                liked: false
            }
        };
        this.player.like();
        assert(this.spy.calledWith('externalAPI.toggleLike();'));
        assert(this.player.isCurrentTrackLiked());
    });

    it('emits EVENT_TRACK after like() is called', function(){
        this.player.state = {
            track: {
                liked: false
            }
        };
        this.player.like();
        this.player.on(
            'EVENT_TRACK',
            function() {
                assert(true);
            }
        );
    });

    it('calls setPosition with an argument in external API', function(){
        let position = 111;
        this.player.setPosition(position);
        assert(this.spy.calledWith('externalAPI.setPosition('+ position +');'));
    });
});
