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

        this.init();
    }

    init() {

        this.canvas = document.createElement('canvas');

        this.canvas.width = controllerboxSize * slots;
        this.canvas.height = controllerboxSize;

        this.ctx = this.canvas.getContext('2d');
        // Create 3d mesh
        this.texture = new THREE['Texture'](this.canvas);
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

        this.mesh['position']['set'](-22, -12, -15);
        this.micrio['THREE']['_camera']['add'](this.mesh);
    }

    render() {
        this.opened = true;

        this.micrio['camera']['render']();
    }


    display() {
        this.draw();
        this.render();
    }


    // Drawing logic
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, 10, 50);

        this.texture['needsUpdate'] = true;
    }

}