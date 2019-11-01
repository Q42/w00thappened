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
		fetch("/levels/level1.json")
			.then(response => response.json())
			.then(json => this.startLevel(json));

	}

	startLevel(level) {
		console.log("Start level:" + level.name);
		this.level = level;
	}

	clickedItem(marker) {
		console.log('clicked on item!', marker);

		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			//Render possible actions in item.actions
			var actions = item.actions
			.filter(function (action) {
				return action.isDefault == true;
			})
			.map(function (action) {
				return action.input
			});

			if(!marker._actions)
				marker._actions = new ActionPopup(this, marker, actions);

			marker._actions.toggle(item);
		}
	}

	//Reply to item with a selected reply
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
					this.renderConversationOptions(marker, item, action.continue);

				if(action.script){
					//TODO: run custom script if available
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

	//Renders a box to select a conversation item
	renderConversationOptions(marker, item, idList) {
		//TODO: Render dialog with all conversation options
		if(item != null)
		{
			var replies = item.actions.filter(function (action) {
				//TODO: Also filter on inventory items
				return idList.includes(action.id);
			})
			.map(function (reply) {
				return reply.input
			});
			
			console.log("Render replies", replies);

			marker._actions = new ActionPopup(this, marker, replies);
			marker._actions.toggle(item);
		}

	}

	printText(string, x, y) {
		new Text(this.micrio, string, x, y);
	}

	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
