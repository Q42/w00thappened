import Text from './text.js';
import ActionPopup from './action.js';

export default class Level {
	constructor(game, micrio) {
		this.game = game;	
		this.micrio = micrio;

		this.level = null;
		this.lastText = null;
		this.tos = [];
		this.markers = [];
	}

	activate(){
		fetch("./levels/" + this.micrio.id + ".json")
			.then(response => response.json())
			.then(json => this.startLevel(json));

		if(this.micrio['modules']['markers'])
			this.markers = this.micrio['modules']['markers']['data'];

		if(this.micrio.id == 'UPbPS') {
			this.micrio['THREE']['embeds']['add'](
				'https://b.micr.io/LzKWd/video/mario_1.mp4',
				.99, .51, .018, {
					'isVideo': true,
					'greenScreen': true,
					'fade': true
				}
			);
		}
	}

	startLevel(level) {
		this.level = level;

		// only show intro text first time you enter the scene
		if (level['dialog'] && this.game.hasPlayedIntroTexts.indexOf(this.micrio.id) === -1) {
			this.showDialog(level['dialog']);
			this.game.hasPlayedIntroTexts.push(this.micrio.id);
		}
	}

	showDialog(dialog) {
		dialog.forEach((obj,index) => {
			this.tos.push(setTimeout(function(){
				this.printText(dialog[index], 0.5,0.5);
			}.bind(this), 3000 * (index)));
		});
	}

	//From game logic, when micrio marker is clicked
	clickedItem(marker) {
		const item = this.getItemForId(marker.id);
		if(item != null) {
			if(marker._actions && marker._actions.opened)
				marker._actions.close();

			else this.renderActionOptions(marker, item, null);
		}
	}

	//Renders a box to select a conversation item
	renderActionOptions(marker, item, idList) {
		if(!item) return;

		//TODO: Render dialog with all conversation options

		// game.inventory.items = [MicrioMarker]
		const myitems =  this.game.inventory.items.map(marker => marker.id);
		const replies = item['actions'].filter(action =>
			(action['notInInventoryFilter'] == undefined || !myitems.includes(action['notInInventoryFilter']))
			&& (action['inventoryFilter'] == undefined || myitems.includes(action['inventoryFilter']))
			&& ((idList != null && idList.includes(action.id)) || (idList == null && action['isDefault']))
		).map(reply => reply['input']);

		if(marker._actions) marker._actions.close();
		marker._actions = new ActionPopup(this, marker, replies);
		marker._actions.open();
	}

	//Selected item from action options
	actionItem(marker, action) {
		const itemId = marker.id;
		const item = this.getItemForId(itemId);
		const todo = item && item['actions'].find(item => item['input'] == action);
		if(todo != null)
		{
			if (todo['input'].toLowerCase() == 'pick up')
				this.game.inventory.addItem(marker);

			//Render reply
			this.printText(todo['output'], marker.x, marker.y);

			if(todo['continue'])
				this.renderActionOptions(marker, item, todo['continue']);

			if(todo['navigateTo'])
				this.game.goto(todo['navigateTo']);
		}
	}
	
	getItemForId(itemId) {
		return this.level['items'].find(item => item['micrioId'] == itemId);
	}

	printText(string, x, y) {
		if(this.lastText)
			this.lastText.remove();

		if(!string) return;

		this.lastText = new Text(this.micrio, string, x, y);
		this.tos.push(setTimeout(function(){ 
			if(this.lastText)
				this.lastText.remove(); 
			}.bind(this), 5000));
	}

	deactivate(){
		if(this.lastText) this.lastText.remove();

		while(this.tos.length) clearTimeout(this.tos.shift());
	}

}
