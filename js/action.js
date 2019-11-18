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

        let widestText = 25;

        const lineHeight = 10;
        const height = lineHeight * this.actions.length;

        this.actions.forEach(a => {
            const text = new Text(this.micrio, a, null, null, '#ffff00', true);

            console.log(text.canvas.width / 8);
            widestText = Math.max(text.canvas.width / 8, widestText);
        })
        console.log(widestText);
        this.mesh = new THREE['Mesh'](
            new THREE['PlaneBufferGeometry'](widestText + 5, height + 5),
            new THREE['MeshBasicMaterial']({
                'color': 0x000000,
                'depthWrite': false,
                'depthTest': false,
                'transparent': true,
                'opacity': 1
            })
        );

        let y = height / 2;
        this.actions.forEach(a => {
            const text = new Text(this.micrio, a, null, null, '#ffff00', true);
            text.mesh['position'].y = y - lineHeight / 2;
            text.mesh['position'].z = -20;
            text.mesh['material']['opacity'] = .75;
            this.mesh.add(text.mesh);
            y -= lineHeight;
            text.mesh.onclick = () => {
                this.level.actionItem(this.item, a);
                this.close();
            }

            widestText = Math.max(text.canvas.width, widestText)
        })

        console.log(widestText);

        this.mesh['renderOrder'] = 119;
    }

    toggle() {
        if (this.opened) this.close();
        else this.open();
    }

    open() {
        if (this.opened) return;
        this.opened = true;

        if (this.level.game.currentPopup) this.level.game.currentPopup.close();

        this.level.game.currentPopup = this;
        this.micrio['THREE']['intersect'] = this.mesh['children'];

        const coo = this.micrio['THREE']['getPosition'](
            this.item.x + .05,
            this.item.y,
            75
        );

        this.mesh['position']['set'](coo.x, coo.y, coo.z);
        this.mesh['lookAt'](0, 0, 0);

        this.micrio['THREE']['_scene']['add'](this.mesh);
        //this.micrio['camera']['render']();

    }

    close() {
        if (!this.opened) return;
        this.opened = false;

        this.level.game.currentPopup = null;
        this.micrio['THREE']['intersect'] = null;

        this.micrio['THREE']['_scene']['remove'](this.mesh);
        //this.micrio['camera']['render']();
    }
}