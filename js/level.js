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

	getItemForId(itemId) {
		var item = level.items.filter(function (item) {
			return item.micrioId == itemId;
		});

		return item[0];
	}

	getMicrioObjectForId(itemId) {
		//TODO: How to get Micrio object for id?
	}

	interactWith(itemId)
	{
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			//Render possible actions in item.actions

		}
	}

	//Initiate a conversation with item
	talkTo(itemId)
	{
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			//Render options
			renderConversationOptions(item, item.defaultConversationOptions);

		}
	}

	//Renders a box to select a conversation item
	renderConversationOptions(item, idList) {
		//TODO: Render dialog with all conversation options

		var item = this.getItemForId(itemId);
		if(item != null)
		{
			var replies = item.conversations.filter(function (item) {
				//TODO: Also filter on inventory items
				return idList.includes(item.id);
			});
			
		}

	}

	printText(string, x, y) {
		new Text(this.micrio, string, x, y);
	}

	//Reply to item with a selected reply
	reply(itemId, selectedId)
	{
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			var replies = item.conversations.filter(function (item) {
				return item.id == selectedId;
			});

			if(replies[0] != null)
			{
				//Render reply
				//TODO: get X Y for micrio item: getMicrioObjectForId(itemId) implementeren
				printText(reply.output, 0, 0);

				if(reply.continue)
					renderConversationOptions(item, reply.continue);

				//TODO: run custom script if available
			}
		}
	}


	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
