export default class Inventory {
	constructor(game) {
		this.game = game;

		this.ItemType = {
			none: 0,
			key: 1,
			paper: 2,
			length: 3,
		}

		this.ItemProperties = {
			name: 0,
			sprite: 1,
			description: 2,
			useSound: 3,
			popupSound: 4,
			amount: 5,
			length: 6,
		}

		this.inventorySize = 20;

		this.inventory = [];
		this.itemDefinitions = [];

		this.init();
		console.log(this.inventory);
		console.log(this.itemDefinitions);
	}

	init() {
		// Fill all inventory slots with item none.
		this.inventory[this.inventorySize - 1] = this.ItemType.none;
		this.inventory.fill(this.ItemType.none);
		this.declareItemDefinitions();
	}

	declareItemDefinitions() {
		// Grid for items and properties
		// Fill grid with undefined
		for (let i = 0; i < this.ItemType.length; i++) {
			let properties = [];
			properties[this.ItemProperties.length - 1] = undefined;
			properties.fill(null);
			this.itemDefinitions.push(properties);
		}
		// Add items!!
		this.addItemDef(this.ItemType.none, '', '', '', '', '', 0);
		this.addItemDef(this.ItemType.key, '', '', '', '', '', 0);
		this.addItemDef(this.ItemType.paper, '', '', '', '', '', 0);

		this.addItemToInv(this.ItemType.key, 3);
		this.addItemToInv(this.ItemType.key, 3);
		this.removeItemFromInv(this.ItemType.key, 8);
	}

	addItemDef(itemType, name, sprite, description, useSound, popupSound, amount) {
		// Add an itemdefinition to the itemDefinitions array
		this.itemDefinitions[itemType][this.ItemProperties.name] = name;
		this.itemDefinitions[itemType][this.ItemProperties.sprite] = sprite;
		this.itemDefinitions[itemType][this.ItemProperties.description] = description;
		this.itemDefinitions[itemType][this.ItemProperties.useSound] = useSound;
		this.itemDefinitions[itemType][this.ItemProperties.popupSound] = popupSound;
		this.itemDefinitions[itemType][this.ItemProperties.amount] = amount;
	}

	addItemToInv(itemType, amount) {
		const itemIndex = this.inventory.findIndex(type => type === itemType); // Returns -1 if item is not in inventory
		if (itemIndex == -1) {
			// If item is not in inventory
			const emptySlotIndex = this.inventory.findIndex(type => type === this.ItemType.none); // Find the first empty slots
			// Add to inventory
			this.inventory[emptySlotIndex] = itemType;
			// add amount
			this.itemDefinitions[itemType][this.ItemProperties.amount] = amount;
		} else {
			// If item was already in inventory
			this.itemDefinitions[itemType][this.ItemProperties.amount] += amount;
		}
	}

	removeItemFromInv(itemType, amount) {
		const itemIndex = this.inventory.findIndex(type => type === itemType); // Returns -1 if item is not in inventory
		if (itemIndex != -1) {
			// If item is is inventory
			this.itemDefinitions[itemType][this.ItemProperties.amount] -= amount;
			if (this.itemDefinitions[itemType][this.ItemProperties.amount] <= 0) {
				this.inventory[itemIndex] = this.ItemType.none;
				this.itemDefinitions[itemType][this.ItemProperties.amount] = 0;
			}
		}
	}
}
