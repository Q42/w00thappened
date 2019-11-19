export default class Hand {
    constructor(game) {
        this.game = game;
        this.micrio = game.micrio;
        this.held_item = null;
        this.ani = new Micrio.Camera.Animate();

        this.init();
    }

    init() {
        this.handTexture = new THREE.TextureLoader().load('../images/hand.png');

        //DEBUG
        //this.texture = new THREE.TextureLoader().load('https://b.micr.io/LzKWd/assets/1f29c0d8-5a98-4dfd-9fea-c938b8b6081c.64.png');

        this.handMesh = new THREE['Mesh'](
            new THREE['PlaneBufferGeometry'](20, 13),
            new THREE['MeshBasicMaterial']({
                'map': this.handTexture,
                'color': 0xffffff,
                'depthWrite': false,
                'depthTest': false,
                'transparent': true,
            })
        );

        this.itemMesh = new THREE['Mesh'](
            new THREE['PlaneBufferGeometry'](13, 5),
            new THREE['MeshBasicMaterial']({
                'map': this.texture,
                'color': 0xffffff,
                'depthWrite': false,
                'depthTest': false,
                'transparent': true,
            })
        );

        this.handMesh['renderOrder'] = 120;
        this.itemMesh['renderOrder'] = 121;

        this.handMesh['position']['set'](23, -8, -15);
        this.itemMesh['position']['set'](19, -7, -15);

        this.handMesh.rotation.set(9.9, 30.2, 10);
        this.itemMesh.rotation.set(2, 29.5, 9.8);

        this.micrio['THREE']['_camera']['add'](this.handMesh);

        // DEBUG
        //this.micrio['THREE']['_camera']['add'](this.itemMesh);
        this.micrio['camera']['render']();
    }


    loadItem(item) {
        this.itemMesh.material.map = new THREE.Texture(item._images[0]);
        this.itemMesh.material.map.needsUpdate = true;
        this.micrio['THREE']['_camera']['add'](this.itemMesh);
        this.micrio['camera']['render']();
        console.log('item id: ', item.id);
        this.heldItem = item;
    }

    animate() {
        let index = 5;

        const ani = this.ani.add(0, 1, 200, p => {
            if (p <= 50) {
                console.log('progress', p);
                // this.handMesh.rotation.set(9.9 - p, 30.2, 10);
                this.handMesh['position']['set'](23, -8 - (p * index), -15);
                this.micrio['camera']['render']();
            } else if (p 100 <= 50) {

            }


        }, undefined, 'hand');
    }

    empty() {
        if (this.itemMesh['parent']) this.itemMesh['parent'].remove(this.itemMesh);
        this.micrio['camera']['render']();
    }

    hide() {
        // future method...
    }


}