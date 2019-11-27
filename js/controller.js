const scale = 4;
const slots = 1
const padding = 2;

const controllerboxSize = 4 * scale;
const THREE = window['THREE'];

export default class Controller {
	constructor(game) {
		this.game = game;
		this.micrio = game.micrio;

		// Internals
		this.mesh = null;
		this.texture = null;


		this.canvas = document.createElement('canvas');

		this.canvas.width = controllerboxSize * slots;
		this.canvas.height = controllerboxSize;

		this.ctx = this.canvas.getContext('2d');
		// Create 3d mesh
		this.texture = new THREE.TextureLoader().load('https://b.micr.io/LzKWd/assets/9cecb6b9-36b3-4d65-a24a-59afe666183a.64.png');

		this.mesh = new THREE['Mesh'](
			new THREE['PlaneBufferGeometry']((controllerboxSize / 8) * slots, controllerboxSize / 8),
			new THREE['MeshBasicMaterial']({
				'map': this.texture,
				'color': 0xffffff,
				'depthWrite': false,
				'depthTest': false,
				'transparent': true,
			})
		);
		this.texture['needsUpdate'] = true;
		this.mesh['renderOrder'] = 119;
		// this.mesh.rotation.set(0, 45, 0);
		this.mesh['position']['set'](-28, -12, -15);
		this.micrio['THREE']['_camera']['add'](this.mesh);
		this.micrio['camera']['render']();
	}

}