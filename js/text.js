const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 512;
const ctx = canvas.getContext('2d');

export default class Text {
	constructor(micrio, text='', x=.5, y=.5, color='#ff0000', independent=false, isStatic=true) {
		this.micrio = micrio;
		this.text = text;
		this.x = x;
		this.y = y;
		this.color = color;
		this.independent = independent;
		this.static = isStatic;

		this.mesh = null;
		this.texture = null;
		this.measuredWidth = 0;

		this.src = this.drawCanvas();
		this.image = new Image;
		this.image.onload = this.place.bind(this);
		this.image.src = this.src;

		this.onload = null;
	}

	place(){
		const THREE = self['THREE'];

		this.texture = new THREE['Texture'](this.image);

		const w = canvas.width / 8;
		const h = w * (canvas.height / canvas.width);

		this.mesh = new THREE['Mesh'](
			new THREE['PlaneBufferGeometry'](w, h),
			new THREE['MeshBasicMaterial']({
				'map': this.texture,
				'depthWrite': false,
				'depthTest': false,
				'transparent': true,
			})
		);
		this.texture['needsUpdate'] = true;
		this.mesh['renderOrder'] = 120;

		if(this.static) {
			this.mesh['position']['set'](this.x,this.y,-100);
			this.micrio['THREE']['_camera']['add'](this.mesh);
			this.micrio['camera']['render']();
		}

		else if(!this.independent) {
			const coo = this.micrio['THREE']['getPosition'](this.x,this.y, 50);
			this.mesh['position']['set'](coo.x, coo.y, coo.z);
			this.mesh['lookAt'](0,0,0);
			this.micrio['THREE']['_scene']['add'](this.mesh);
			this.micrio['camera']['render']();
		}

		if(this.onload) this.onload();

	}

	remove(){
		if(this.mesh && this.mesh['parent']) this.mesh['parent']['remove'](this.mesh);
	}

	// Canvas rendering
	drawCanvas() {
		// Font settings
		const scale = 1;
		const fontSize = 38 * scale;
		const lineHeight = 50 * scale;
		const fontWeight = 600;
		const font = 'normal '+fontWeight+' '+fontSize+'px / '+lineHeight+'px Acme';

		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 8;
		ctx.miterLimit = 2;

		const lines = this.text.split('\n');

		for(let i=0;i<lines.length;i++)
			if(lines[i] !== '') lines.splice.apply(
				lines,
				[i, 1, ...this.resizeLine(lines[i])]
			);

		this.measuredWidth = 0;

		lines.forEach(l => {
			this.measuredWidth = Math.max(ctx.measureText(l).width, this.measuredWidth);
		})

		canvas.width = this.measuredWidth;
		const x = canvas.width/2;
		canvas.height = lineHeight * lines.length;

		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 8;
		ctx.miterLimit = 2;

		lines.forEach((l,i) => {
			const y = (i+1) * lineHeight - lineHeight + fontSize;
			ctx.strokeText(l, x, y);
			ctx.fillStyle = this.color;
			ctx.fillText(l, x, y);
		});

		return canvas.toDataURL()
	}

	resizeLine(text) {
		const words = text.split(' ');

		let num=words.length;
		let first=null;

		for(;num>=0;num--) {
			first = words.slice(0,num);
			if(num == 1 || ctx.measureText(first.join(' ')).width < 1024) break;
		}

		return [first, words.slice(num)]
			.filter(t => t && t.length)
			.map(t => t.join(' '));
	}
}
