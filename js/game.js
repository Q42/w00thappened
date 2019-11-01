import Level from './level.js';
import Inventory from './inventory.js';
import { fragmentShader } from './shader.js';

export default class Game {
	constructor(){
		console.log('New game!');

		this.inventory = null;
		this.levels = {};
		this.currentLevel = null;
		this.currentPopup = null;

		// Main container
		this._container = document.querySelector('micr-io');

		// Function bindings
		this.created = this.created.bind(this);
		this.init = this.init.bind(this);
		this.setLevel = this.setLevel.bind(this);
		this.onclicked = this.onclicked.bind(this);

		if(document.fonts && document.fonts.load)
			document.fonts.load('10pt "Acme"').then(() => this.fontLoaded());
		else this.fontLoaded();
	}

	fontLoaded(){
		if(this._container && this._container['micrio']) {
			this.micrio = this._container['micrio'];
			this.customShader();
			this.created();
		}
		else window.addEventListener('micrio-created', this.created);
		window.addEventListener('micrio-created', this.customShader.bind(this));
	}

	created(e){
		window.removeEventListener('micrio-created', this.created);
		if(e && e.detail) {
			this.micrio = e.detail;
			this._container = this.micrio['container'];
		}
		if(this.micrio['isLoaded']) this.init();
		else this._container.addEventListener('metadata', this.init);
		this._container.addEventListener('pre-metadata', this.fixForVR.bind(this))
		this._container.addEventListener('click', this.onclick.bind(this));
		this._container.addEventListener('mousemove', this.mousemove.bind(this));
	}

	init(){
		console.log('Init game!', this.micrio)

		// For each micrio image loaded, set a level
		this._container.removeEventListener('metadata', this.init);
		this._container.addEventListener('metadata', this.setLevel);

		// Create inventory
		this.inventory = new Inventory(this);

		// Create our first, main level
		this.setLevel(this.micrio);
	}

	setLevel(eventOrMicrio) {
		const micrio = this.micrio = eventOrMicrio.detail ? eventOrMicrio.detail : eventOrMicrio;

		if(this.currentLevel) this.currentLevel.deactivate();

		if(!this.levels[micrio.id])
			this.levels[micrio.id] = new Level(this, micrio);

		this.currentLevel = this.levels[this.micrio.id];
		this.micrio['THREE']['onClickVR'] = this.onclicked;

		this.currentLevel.activate();
	}

	// Create data of current game state and save to localStorage
	saveGame(){

	}

	// Load saved data and set game to loaded state
	loadGame(){

	}

	// Make all markers rendered in WebGL and set custom shader
	fixForVR() {
		this._container.micrio['data']['forceGL'] = true;
	}

	// Set custom shader
	customShader(e) {
		(e ? e.detail : this.micrio)['data']['fragmentShader'] = fragmentShader;
	}

	// For in browser
	onclick(e) {
		if(!this.micrio || !this.micrio['THREE']) return;

		// First check if clicked action menu
		if(this.currentPopup) {
			const hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], this.currentPopup.mesh.children)[0];
			if(hit && hit['object'].onclick) {
				this.onclicked(hit);
				return;
			}
		}

		// Otherwise check for marker click
		this.onclicked(this.micrio['THREE']['getCast']([e.clientX, e.clientY])[0]);
	}

	onclicked(hit) {
		if(!hit || !hit['object']) return;

		if(this.currentPopup) {
			if(hit['object'].onclick) {
				hit['object'].onclick();
				return;
			}
		}

		const marker = hit['object']['marker'];
		if(marker) {
			if(marker['link']) marker.open();
			else this.currentLevel.clickedItem(marker);
		}
	}

	mousemove(e) {
		if(!this.micrio || !this.micrio['THREE']) return;
		let hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY])[0];

		// Try hoverstate for popup
		if(!hit && this.currentPopup) {
			hit = this.micrio['THREE']['getCast']([e.clientX, e.clientY], this.currentPopup.mesh.children)[0];

			if(hit != this.currentPopup.hovered) {
				if(this.currentPopup.hovered)
					this.currentPopup.hovered['object']['material']['opacity'] = .75;

				if(hit) hit['object']['material']['opacity'] = 1;
			}
			this.currentPopup.hovered = hit;
			this.micrio['camera']['render']();

		}

		const marker = hit && hit['object']['marker'];
		const c = this.micrio['el'].classList;

		this._container.title = marker && marker.title || '';
		if(hit) { if(!c.contains('hover')) c.add('hover') }
		else if(c.contains('hover')) c.remove('hover');
	}

}

window.game = new Game
