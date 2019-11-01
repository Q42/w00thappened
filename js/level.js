import Text from './text.js';
import ActionPopup from './action.js';

export default class Level {
	constructor(game, micrio) {
		this.game = game;	
		this.micrio = micrio;
	}

	activate(){
		console.log('Activate level', this.micrio.id);

		//TODO: Load level based on micrioId
		fetch("/levels/" + this.micrio.id + ".json")
			.then(response => response.json())
			.then(json => this.startLevel(json));
	}

	startLevel(level) {
		console.log("Start level:" + level.name);
		this.level = level;
	}

	//From game logic, when micrio marker is clicked
	clickedItem(marker) {
		console.log('clicked on item!', marker.id);

		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			this.renderActionOptions(marker, item, null);
		}
	}

	//Renders a box to select a conversation item
	renderActionOptions(marker, item, idList) {
		//TODO: Render dialog with all conversation options
		if(item != null)
		{
			var replies = item.actions.filter(function (action) {
				//TODO: Also filter on inventory items
				return (idList != null && idList.includes(action.id)) || (idList == null && action.isDefault);
			})
			.map(function (reply) {
				return reply.input
			});
			
			console.log("Render replies", replies);
			if(marker._actions)
				marker._actions.close();
			
			marker._actions = new ActionPopup(this, marker, replies);
			marker._actions.toggle();
		}

	}

	//Selected item from action options
	actionItem(marker, action) {
		console.log('action item!', action, marker);

		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			var action = item.actions.find(function (item) {
				return item.input == action;
			});

			if(action != null)
			{
				console.log("Selected action", action);

				//Render reply
				this.printText(action.output, marker.x, marker.y);

				if(action.continue)
					this.renderActionOptions(marker, item, action.continue);

				if(action.script){
					//TODO: run custom script if available
				}

				if(action.navigateTo) {
					this.micrio.modules.navigator.goto(action.navigateTo);
				}
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
		setTimeout(function(){ 
			if(this.lastText)
				this.lastText.remove(); 
			}.bind(this), 5000);
	}

	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
