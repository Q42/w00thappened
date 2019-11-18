const canvas = document.createElement('canvas');

const scale = 4;
const slots = 1
const padding = 2;

const controllerboxSize = 4 * scale;

canvas.width = controllerboxSize * slots;
canvas.height = controllerboxSize;

const ctx = canvas.getContext('2d');
const THREE = window['THREE'];


export default class Controller {
    constructor(game) {
        this.game = game;
        this.micrio = game.micrio;

        this.controllerboxMesh = null;
        this.controllerboxTexture = null;

        this.init()
    }

    init() {
        // const ratio = canvas.width / canvas.height;

        // Create 3d mesh
        // this.controllerboxTexture = new THREE['Texture'](canvas);
        this.controllerboxMesh = new THREE['Mesh'](
            new THREE['PlaneBufferGeometry'](4, 4),
            new THREE['MeshBasicMaterial']({
                'color': 0x000000,
                'depthWrite': false,
                'depthTest': false,
                'transparent': true,
            })
        );

        // this.controllerboxTexture['needsUpdate'] = true;
        this.controllerboxMesh['renderOrder'] = 119;

        this.controllerboxMesh['position']['set'](-15, -12, -15);
        this.micrio['THREE']['_camera']['add'](this.controllerboxMesh);
    }

    drawControllerbox() {
        this.drawButton(null, 2);
        this.update()
    }

    drawButton(color = 'white', x) {
        ctx.fillStyle = color;
        ctx.fillRect(x, padding, controllerboxSize - padding, controllerboxSize - padding);
    }

    update() {
        this.opened = true;
        this.micrio['camera']['render']();
    }

}