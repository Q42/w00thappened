import Text from './text.js';

export default class Level {
	constructor(game, micrio) {
		this.game = game;	
		this.micrio = micrio;	
	}

	activate(){
		console.log('Activate level', this.micrio.id);

		//TODO: Load level based on micrioId
		fetch("/levels/level1.json")
			.then(response => response.json())
			.then(json => this.startLevel(json));

	}

	startLevel(level) {
		console.log("Start level:" + level.name);
		this.level = level;

	}

	talkTo(itemId)
	{
		var item = level.items
	}

	printText(string, x, y) {
		new Text(this.micrio, string, x, y);
	}

	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
