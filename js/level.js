import Text from './text.js';
import ActionPopup from './action.js';

export default class Level {
	constructor(game, micrio) {
		this.game = game;	
		this.micrio = micrio;

		this.level = null;
		this.lastText = null;
		this.tos = [];
	}

	activate(){

		//TODO: Load level based on micrioId
		fetch("/levels/" + this.micrio.id + ".json")
			.then(response => response.json())
			.then(json => this.startLevel(json));

		if(this.micrio.id == 'UPbPS') {
			this.micrio['THREE']['embeds']['add'](
				'https://b.micr.io/LzKWd/video/mario_1.mp4',
				.99, .51, .018, {
					isVideo: true,
					greenScreen: true,
					fade: true
				}
			);
		}
	}

	startLevel(level) {
		this.level = level;

		// only show intro text first time you enter the scene
		if (level.dialog && this.game.hasPlayedIntroTexts.indexOf(this.micrio.id) === -1) {
			this.showDialog(level.dialog);
			this.game.hasPlayedIntroTexts.push(this.micrio.id);
		}
	}

	showDialog(dialog) {
		dialog.forEach(function(obj,index) {
			this.tos.push(setTimeout(function(){
				this.printText(dialog[index], 0.5,0.5);
			}.bind(this), 3000 * (index)));
		}.bind(this));
	}

	//From game logic, when micrio marker is clicked
	clickedItem(marker) {
		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
			this.renderActionOptions(marker, item, null);
	}

	//Renders a box to select a conversation item
	renderActionOptions(marker, item, idList) {
		//TODO: Render dialog with all conversation options
		if(item != null)
		{
			var replies = item.actions.filter(function (action) {
				//TODO: Also filter on inventory items

				// game.inventory.items = [MicrioMarker]
				var myitems =  this.game.inventory.items.map(marker => {
					return marker.id;
				})
				return (action.notInInventoryFilter == undefined || !myitems.includes(action.notInInventoryFilter))
					&& (action.inventoryFilter == undefined || myitems.includes(action.inventoryFilter))
					&& ((idList != null && idList.includes(action.id)) || (idList == null && action.isDefault));
			}.bind(this))
			.map(function (reply) {
				return reply.input
			});
			
			if(marker._actions)
				marker._actions.close();
			
			marker._actions = new ActionPopup(this, marker, replies);
			marker._actions.toggle();
		}

	}

	//Selected item from action options
	actionItem(marker, action) {

		const itemId = marker.id;
		const item = this.getItemForId(itemId);
		const todo = item && item.actions.find(item => item.input == action);
		if(todo != null)
		{
			var action = item.actions.find(function (item) {
				return item.input == action;
			});

			if(action != null)
			{
				if (action.input.toLowerCase() == 'pick up') {
					this.game.inventory.addItem(marker);
				}
			}

			//Render reply
			this.printText(action.output, marker.x, marker.y);

			if(todo.continue)
				this.renderActionOptions(marker, item, action.continue);

			/*if(todo.script){
				//TODO: run custom script if available
			}*/

			if(todo.navigateTo) {
				this.game.goto(todo.navigateTo);
			}
		}
	}
	
	getItemForId(itemId) {
		var item = this.level.items.find(function (item) {
			return item.micrioId == itemId;
		});

		return item;
	}

	printText(string, x, y) {
		if(this.lastText)
			this.lastText.remove();

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
