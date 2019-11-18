import Text from './text.js';

const canvas = document.createElement("canvas");

const scale = 4;
const boxSize = 16 * scale;
const paddingSize = 4 * scale;
const fullBoxSize = boxSize + paddingSize;

canvas.width = 5 * boxSize + 6 * paddingSize;
canvas.height = 4 * boxSize + 5 * paddingSize;

const ctx = canvas.getContext("2d");

const THREE = window['THREE'];

export default class Inventory {
    constructor(game) {
        this.game = game;
        this.micrio = game.micrio;

        this.opened = false;
        this._audio = new Audio;

        // Internals
        this.mesh = null;
        this.texture = null;

        this.inventorySize = 20;
        this.items = new Array(this.inventorySize);

        this.to = null;

        this.init();
    }

    init() {
        const ratio = canvas.width / canvas.height;

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

        this.mesh['position']['set'](0, -8, -15);
    }

    show() {
        this.opened = true;
        this.micrio['THREE']['_camera']['add'](this.mesh);
        this.micrio['camera']['render']();
    }

    hide() {
        this.opened = false;
        if (this.mesh['parent']) this.mesh['parent'].remove(this.mesh);
    }

    /*clicked(x,y) {
    	const _x = Math.floor(x * canvas.width / fullBoxSize);
    	const _y = Math.floor(y * canvas.height / fullBoxSize);
    	const item = this.items[_y * 5 + _x];

    	if(item) {
    		console.log('use item!!')
    	}
    }*/

    addItem(marker) {
        const emptySlotIndex = this.items.findIndex(item => !item); // Find the first empty slots
        this.items[emptySlotIndex] = marker;

        if (marker.title) {
            const txt = new Text(this.micrio, 'Picked up ' + marker.title, 0, -12, '#00ff00');
            setTimeout(() => txt.remove(), 4000);
        }

        if (marker['audio'] && marker['audio']['fileUrl']) {
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
            image.src = img.src.replace(/\.(jpg|png)/, '.64.$1');
            image.crossOrigin = 'anonymous';
            return image;
        })

        if (marker._images[0]) marker._images[0].onload = () => {
            this.showHide();
        }
        else this.showHide();
    }

    showHide() {
        clearTimeout(this.to);
        this.draw();
        this.show();
        this.to = setTimeout(() => this.hide(), 4000);
    }

    removeItem(id) {
        const index = this.items.findIndex(m => m.id == id);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.draw();
        }
    }

    // Drawing logic
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'brown';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw boxes
        let pos = { x: 0, y: paddingSize };
        for (let index = 0; index < this.items.length; index++) {
            const item = this.items[index];

            pos.x += fullBoxSize;
            if (index % 5 == 0) {
                // New row
                pos.x = paddingSize;
                if (index != 0) pos.y += fullBoxSize;
            }

            // Draw box
            ctx.fillStyle = 'black';
            ctx.fillRect(pos.x, pos.y, boxSize, boxSize);

            // Draw image
            if (item && item._images[0])
                ctx.drawImage(item._images[0], pos.x, pos.y, boxSize, boxSize);
        }

        this.texture['needsUpdate'] = true;
    }

}