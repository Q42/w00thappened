export default class Level {
	constructor(game, micrio) {
		this.game = game;	
		this.micrio = micrio;	
	}

	activate(){
		console.log('Activate level', this.micrio.id);
	}

	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
