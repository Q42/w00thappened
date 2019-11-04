
export default class Text {
	constructor(micrio, text='', x=.5, y=.5, color='#ff0000', independent=false, isStatic=true) {
		this.micrio = micrio;
		this.text = text;
		this.x = x;
		this.y = y;
		this.color = color;
		this.independent = independent;
		this.static = isStatic;

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.mesh = null;
		this.texture = null;
		this.measuredWidth = 0;

		this.onload = null;

		this.drawCanvas();
		this.place();

	}

	place(){
		const THREE = self['THREE'];

		this.texture = new THREE['Texture'](this.canvas);

		const w = this.canvas.width / 8;
		const h = w * (this.canvas.height / this.canvas.width);

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

	}

	remove(){
		if(this.mesh && this.mesh['parent']) this.mesh['parent']['remove'](this.mesh);
		delete this.mesh;
		delete this.ctx;
		delete this.canvas;
	}

	// Canvas rendering
	drawCanvas() {
		// Font settings
		const scale = 1;
		const fontSize = 38 * scale;
		const lineHeight = 50 * scale;
		const fontWeight = 600;
		const font = 'normal '+fontWeight+' '+fontSize+'px / '+lineHeight+'px Acme';
		const ctx = this.ctx;

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

		this.canvas.width = this.measuredWidth;
		this.canvas.height = lineHeight * lines.length;

		const x = this.canvas.width/2;

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

	}

	resizeLine(text) {
		const words = text.split(' ');
		const ctx = this.ctx;

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
