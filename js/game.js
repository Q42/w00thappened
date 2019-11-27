import Level from './level.js';
import Inventory from './inventory.js';
import Controller from './controller.js';
import Hand from './hand.js';
import { fragmentShader } from './shader.js';

window['Micrio'].prototype['forceGL'] = true;

export default class Game {
    constructor() {
        this.hasPlayedIntroTexts = [];

        this.inventory = null;
        this.levels = {};
        this.currentLevel = null;
        this.currentPopup = null;

        // Main container
        this.micrio = null;
        this._container = null;

        // Function bindings
        this.create = this.create.bind(this);
        this.init = this.init.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.onclicked = this.onclicked.bind(this);

        if (document.fonts && document.fonts.load)
            document.fonts.load('10pt "Acme"').then(() => this.create());
        else this.create();
    }

    create() {
        this.micrio = new window['Micrio']({
            'id': 'UkwTz',
            'forceGL': true,
            'fragmentShader': fragmentShader,
            'minimap': false,
            'loaderbar': false,
            'noToolbar': true
        });

        this._container = this.micrio['container'];

        this._container.addEventListener('click', this.onclick.bind(this));
        this._container.addEventListener('mousemove', this.mousemove.bind(this));
        this._container.addEventListener('load', this.init);


    }

    init() {
        // For each micrio image loaded, set a level
        this._container.removeEventListener('load', this.init);
        this._container.addEventListener('metadata', this.setLevel);

        // Create inventory
        this.inventory = new Inventory(this);

        // Create Controller Box -- disabled for now
        //this.controller = new Controller(this);

        // Create Hand -- not yet completed
        //this.hand = new Hand(this);

        // Create our first, main level
        this.setLevel(this.micrio);
    }

    setLevel(eventOrMicrio) {
        const micrio = this.micrio = eventOrMicrio.detail ? eventOrMicrio.detail : eventOrMicrio;

        if (this.currentLevel) this.currentLevel.deactivate();
        if (this.currentPopup) this.currentPopup.close();

        if (!this.levels[micrio.id])
            this.levels[micrio.id] = new Level(this, micrio);

        this.currentLevel = this.levels[this.micrio.id];
        this.micrio['THREE']['onClickVR'] = this.onclicked;

        this.currentLevel.activate();
    }

    goto(id) {
        if (this.currentPopup) this.currentPopup.close();
        this.micrio['camera'].stop();
        this.micrio['modules']['navigator']['goto'](id, undefined, true);
    }

    // Create data of current game state and save to localStorage
    saveGame() {

    }

    // Load saved data and set game to loaded state
    loadGame() {

    }

    // For in browser
    onclick(e) {
        if (!this.micrio || !this.micrio['THREE']) return;

        // First check if clicked action menu
        if (this.currentPopup) {
            const hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], this.currentPopup.mesh.children)[0];
            if (hit && hit['object']['onclick']) {
                this.onclicked(hit);
                return;
            }
        }

        // If clickable inventory...
        if (this.controller && this.inventory.opened) {
            const hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], [this.inventory.mesh])[0];
            if (hit) {
                this.inventory.clicked(hit['uv'].x, 1 - hit['uv'].y);
                return;
            }
        }

        // Otherwise check for marker click
        const marker = this.micrio['THREE']['getCast']([e.clientX, e.clientY])[0];
        if (marker) this.onclicked(marker);

        else {
            // If inventory controller...
            if(this.controller) {
                const hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], [this.controller.mesh])[0];
                if (hit) return this.inventory.toggle();
            }

            // Otherwise clicked outside -> close any open popup
            else if (this.currentPopup) this.currentPopup.close();
        }
    }

    onclicked(hit) {
        if (!hit || !hit['object']) return;

        if (this.currentPopup) {
            if (hit['object'].onclick) {
                hit['object'].onclick();
                return;
            }
        }

        const marker = hit['object']['marker'];
        if (marker) {
            if (marker['link']) marker.open();
            else this.currentLevel.clickedItem(marker);
        }
    }

    mousemove(e) {

        if (!this.micrio || !this.micrio['THREE']) return;
        let hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY])[0];

        // Try hoverstate for popup
        if (!hit && this.currentPopup) {
            hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], this.currentPopup.mesh.children)[0];

            if (hit != this.currentPopup.hovered) {
                if (this.currentPopup.hovered)
                    this.currentPopup.hovered['object']['material']['opacity'] = .75;

                if (hit) hit['object']['material']['opacity'] = 1;
            }
            this.currentPopup.hovered = hit;
            this.micrio['camera']['render']();

        }

        const marker = hit && hit['object']['marker'];
        const c = this.micrio['el'].classList;

        if (marker && marker.title) this._container.title = marker.title;
        else this._container.removeAttribute('title');

        if (hit) { if (!c.contains('hover')) c.add('hover') } else if (c.contains('hover')) c.remove('hover');
    }

}

window.game = new Game