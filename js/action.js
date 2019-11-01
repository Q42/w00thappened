import Text from './text.js';

// Action popup
const THREE = self['THREE'];

export default class ActionPopup {
	constructor(level) {
		this.level = level;
		this.micrio = level.micrio;

		this.opened = false;

		this.mesh = new THREE['Mesh'](
			new THREE['PlaneBufferGeometry'](30, 30),
			new THREE['MeshBasicMaterial']({
				'color': 0x222222,
				'depthWrite': false,
				'depthTest': false,
				'transparent': true,
			})
		);

		this.mesh['renderOrder'] = 120;
	}

	toggle(item){
		if(this.opened) this.close();
		else this.open(item);
	}

	open(item){
		if(this.opened) return;
		this.opened = true;
		const coo = this.micrio['THREE']['getPosition'](item.x+.1,item.y-.1, 50);
		this.mesh['position']['set'](coo.x,coo.y,coo.z);
		this.mesh['lookAt'](0,0,0);

		this.micrio['THREE']['scene']['add'](this.mesh);
		this.micrio['camera']['render']();
	}

	close() {
		if(!this.opened) return;
		this.opened = false;
		this.micrio['THREE']['scene']['remove'](this.mesh);
		this.micrio['camera']['render']();
	}
}
