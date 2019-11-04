import Text from './text.js';

const canvas = document.createElement("canvas");
const size = drawSize();
const height = size.height
const width = size.width;
const scale = size.scale;
const boxSize = scale * (size.boxSize + size.padding);
canvas.width = width * scale;
canvas.height = height * scale;
const ctx = canvas.getContext("2d");

const THREE = window['THREE'];

export default class Inventory {
	constructor(game) {
		this.game = game;
		this.micrio = game.micrio;

		this.opened = false;
		this._audio = new Audio;

		this.inventorySize = 20;
		this.items = new Array(this.inventorySize);

		this.init();
	}

	init() {
		const ratio = width / height;

		// Create 3d mesh
		this.texture = new THREE['Texture'](canvas);
		this.mesh = new THREE['Mesh'](
			new THREE['PlaneBufferGeometry'](10 * ratio, 10),
			new THREE['MeshBasicMaterial']({
				'map': this.texture,
				'color': 0xff0000,
				'depthWrite': false,
				'depthTest': false,
				'transparent': true,
			})
		);
		this.texture['needsUpdate'] = true;
		this.mesh['renderOrder'] = 119;

		this.mesh['position']['set'](0,-8,-15);
	}

	show(){
		this.opened = true;
		this.micrio['THREE']['_camera']['add'](this.mesh);
		this.micrio['camera']['render']();
	}

	hide(){
		this.opened = false;
		if(this.mesh['parent']) this.mesh['parent'].remove(this.mesh);
	}

	clicked(x,y) {
		const _x = Math.floor(x * canvas.width / boxSize);
		const _y = Math.floor(y * canvas.height / boxSize);
		const item = this.items[_y * 5 + _x];

		if(item) {
			console.log('use item!!')
		}
	}

	// Dit komt straks uit Micrio
	addItem(marker) {
		const emptySlotIndex = this.items.findIndex(item => !item); // Find the first empty slots
		this.items[emptySlotIndex] = marker;

		if(marker.title) {
			const txt = new Text(this.micrio, 'Picked up ' + marker.title, 0, -12, '#00ff00');
			setTimeout(() => txt.remove(), 4000);
		}

		if(marker['audio'] && marker['audio']['fileUrl']) {
			this._audio.src = marker['audio']['fileUrl'];
			this._audio.play();
		}

		// Remove marker from game world
		marker.remove();

		// Also remove from original JSON so it won't be back later
		const idx = this.game.currentLevel.markers.findIndex(m => m.id == marker.id);
		this.game.currentLevel.markers.splice(idx, 1);

		// Cast any images to real image
		marker._images = marker['images'].map(img => {
			const image = new Image;
			image.src = img.src.replace(/\.(jpg|png)/,'.64.$1');
			image.crossOrigin = true;
			return image;
		})

		if(marker._images[0]) marker._images[0].onload = () => {
			this.showHide();
		}
		else this.showHide();
	}

	showHide(){
		this.draw();
		this.show();
		setTimeout(() => this.hide(), 4000);
	}

	removeItem(id) {
		const index = this.items.findIndex(m => m.id == id);
		if(index >= 0) {
			this.items.splice(index, 1);
			this.draw();
		}
	}

	// Drawing logic
	draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const size = drawSize();
		const height = size.height
		const width = size.width;
		const boxSize = size.boxSize;
		const scale = size.scale;
		const padding = size.padding;

		ctx.fillStyle = 'brown';
		ctx.fillRect(0, 0, width * scale, height * scale);
		// Draw boxes
		let pos = {x: 0, y: padding * scale};
		for (let index = 0; index < this.items.length; index++) {
			const item = this.items[index];

			pos.x += boxSize * scale + padding * scale;
			if (index % 5 == 0) {
				// New row
				pos.x = padding * scale;
				if (index != 0) pos.y += boxSize * scale + padding * scale;
			}

			// Draw box
			ctx.fillStyle = 'black';
			ctx.fillRect(pos.x, pos.y, boxSize * scale, boxSize * scale);

			// Draw image
			if(item && item._images[0]) {
				ctx.drawImage(item._images[0], pos.x, pos.y, boxSize * scale, boxSize * scale);
			}

		}

		this.texture['needsUpdate'] = true;
	}

	drawItemInspect(item) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const size = drawSize();
		const height = size.height
		const width = size.width;
		const scale = size.scale;
		const padding = size.padding;

		ctx.fillStyle = 'brown';
		ctx.fillRect(padding * scale, padding * scale, width / 2 * scale, height * scale - 2 * padding * scale);
		const img = new Image;
		img.src = item[this.ItemProperties.popupSprite];
		console.log(width, height);
		img.onload = function() {
			ctx.drawImage(img, padding * scale, padding * scale, width / 2 * scale, height * scale - 2 * padding * scale);
		}
	}

}
function drawSize() {
	const boxSize = 16;
	const padding = 4;
	const scale = 4;
	const _width = 5 * boxSize + 6 * padding;
	const _height = 4 * boxSize + 5 * padding;
	return {
		width: _width, 
		height: _height,
		boxSize: boxSize,
		padding: padding,
		scale: scale,
	};
}