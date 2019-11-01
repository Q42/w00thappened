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

		this.talkTo("id-from-micrio-editor");
		this.say("id-from-micrio-editor", 1);
	}

	clickedItem(marker) {
		console.log('clicked on item!', marker);

		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			//Render possible actions in item.actions
			var actions = item.actions.map(function (action) {
				return action.name
			});

			if(!marker._actions)
				marker._actions = new ActionPopup(this, marker, actions);

			marker._actions.toggle(item);
		}
	}

	actionItem(marker, action) {
		console.log('action item!', action, marker);
	}

	getItemForId(itemId) {
		var item = this.level.items.filter(function (item) {
			return item.micrioId == itemId;
		});

		return item[0];
	}

	getMicrioObjectForId(itemId) {
		//TODO: How to get Micrio object for id?
	}

	//Initiate a conversation with item
	talkTo(marker)
	{
		var itemId = marker.id;
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			//Render options
			this.renderConversationOptions(marker, item, item.defaultConversationOptions);
		}
	}

	//Renders a box to select a conversation item
	renderConversationOptions(marker, item, idList) {
		//TODO: Render dialog with all conversation options
		if(item != null)
		{
			var replies = item.conversations.filter(function (item) {
				//TODO: Also filter on inventory items
				return idList.includes(item.id);
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

	//Reply to item with a selected reply
	say(itemId, selectedId)
	{
		var item = this.getItemForId(itemId);
		if(item != null)
		{
			var replies = item.conversations.filter(function (item) {
				return item.id == selectedId;
			});

			var reply = replies[0];
			if(reply != null)
			{
				console.log("Using reply", reply);

				//Render reply
				//TODO: get X Y for micrio item: getMicrioObjectForId(itemId) implementeren
				this.printText(reply.output, 0, 0);

				if(reply.continue)
					this.renderConversationOptions(item, reply.continue);

				//TODO: run custom script if available
			}
		}
	}


	deactivate(){
		console.log('Deactivate level', this.micrio.id);
	}
}
