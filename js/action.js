import Text from './text.js';

// Action popup
const THREE = self['THREE'];

export default class ActionPopup {
	constructor(level, item, actions) {
		this.level = level;
		this.micrio = level.micrio;
		this.item = item;
		this.actions = actions;

		this.opened = false;
		this.hovered = null;

		const lineHeight = 5;
		const height = lineHeight * this.actions.length;

		this.mesh = new THREE['Mesh'](
			new THREE['PlaneBufferGeometry'](25, height+5),
			new THREE['MeshBasicMaterial']({
				'color': 0x222222,
				'depthWrite': false,
				'depthTest': false,
				'transparent': true,
				'opacity': .5
			})
		);

		let y = height/2;
		this.actions.forEach(a => {
			const text = new Text(this.micrio, a, null, null, '#ffffff', true);
			text.onload = () => {
				text.mesh['position'].y = y - lineHeight/2;
				text.mesh['material']['opacity'] = .75;
				this.mesh.add(text.mesh);
				y -= lineHeight;
				text.mesh.onclick = () => {
					this.level.actionItem(this.item, a);
					this.close();
				}
			}
		})

		this.mesh['renderOrder'] = 119;
	}

	toggle(){
		if(this.opened) this.close();
		else this.open();
	}

	open(){
		if(this.opened) return;
		this.opened = true;

		this.level.game.currentPopup = this;
		this.micrio['THREE']['intersect'] = this.mesh['children'];

		const coo = this.micrio['THREE']['getPosition'](
			this.item.x+.05,
			this.item.y,
			75
		);

		this.mesh['position']['set'](coo.x,coo.y,coo.z);
		this.mesh['lookAt'](0,0,0);

		this.micrio['THREE']['_scene']['add'](this.mesh);
		this.micrio['camera']['render']();

	}

	close() {
		if(!this.opened) return;
		this.opened = false;

		this.level.game.currentPopup = null;
		this.micrio['THREE']['intersect'] = null;

		this.micrio['THREE']['_scene']['remove'](this.mesh);
		this.micrio['camera']['render']();
	}
}
