const canvas = document.createElement("canvas");
canvas.id = 'inventory';
const size = drawSize();
const height = size.height
const width = size.width;
const scale = size.scale;
canvas.width = width * scale;
canvas.height = height * scale;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

export default class Inventory {
	constructor(game) {
		this.game = game;

		this.itemTypes = []; // Fill with 'none', 'key' etc.

		this.ItemProperties = {
			name: 0,
			sprite: 1,
			description: 2,
			useSound: 3,
			popupSprite: 4,
			amount: 5,
			length: 6,
		}

		this.inventorySize = 20;
		this.inventory = [];
		this.itemDefinitions = [];

		this.init();
	}

	init() {
		// Add the empty slot as item definition
		this.addItemDef('none', 'black', '', '', '', 0);
		// Fill all inventory slots with item none.
		this.inventory[this.inventorySize - 1] = this.itemTypes[0];
		this.inventory.fill(this.itemTypes[0]);
	}

	// Dit komt straks uit Micrio
	addItemToInv(itemType, sprite, description, useSound, popupSprite, amount) {
		const inventoryIndex = this.inventory.findIndex(type => type === itemType); // Returns -1 if item is not in inventory
		if (inventoryIndex == -1) {
			// If item is not in inventory
			const emptySlotIndex = this.inventory.findIndex(type => type === this.itemTypes[0]); // Find the first empty slots
			// Add to inventory
			this.inventory[emptySlotIndex] = itemType;
			// Add new definition
			this.addItemDef(itemType, sprite, description, useSound, popupSprite, 0); // Waardes uit Micrio
			this.itemDefinitions[this.itemTypes.length - 1][this.ItemProperties.amount] = amount;
		} else {
			// If item was already in inventory then we increase the amount
			const itemDefIndex = this.itemTypes.findIndex(type => type === itemType);
			this.itemDefinitions[itemDefIndex][this.ItemProperties.amount] += amount;
		}
		const itemDefIndex = this.itemTypes.findIndex(type => type === itemType);
		this.drawItemInspect(this.itemDefinitions[itemDefIndex]);
	}

	removeItemFromInv(itemType, amount) {
		const itemIndex = this.inventory.findIndex(type => type === itemType); // Returns -1 if item is not in inventory
		if (itemIndex != -1) {
			// If item is is inventory
			const itemDefIndex = this.itemTypes.findIndex(type => type === itemType);
			this.itemDefinitions[itemDefIndex][this.ItemProperties.amount] -= amount;
			if (this.itemDefinitions[itemDefIndex][this.ItemProperties.amount] <= 0) {
				// Remove item from inventory and definitionlist if amount <= 0
				this.inventory[itemIndex] = this.itemTypes[0];
				this.itemDefinitions.splice(itemDefIndex, 1);
			}
		}
	}

	addItemDef(itemType, sprite, description, useSound, popupSprite, amount) {
		// Update ItemType list
		this.itemTypes.push(itemType);
		const itemDefIndex = this.itemTypes.length -1;
		// Add an itemdefinition to the itemDefinitions array
		this.itemDefinitions[itemDefIndex] = [];
		this.itemDefinitions[itemDefIndex][this.ItemProperties.name] = itemType;
		this.itemDefinitions[itemDefIndex][this.ItemProperties.sprite] = sprite;
		this.itemDefinitions[itemDefIndex][this.ItemProperties.description] = description;
		this.itemDefinitions[itemDefIndex][this.ItemProperties.useSound] = useSound;
		this.itemDefinitions[itemDefIndex][this.ItemProperties.popupSprite] = popupSprite;
		this.itemDefinitions[itemDefIndex][this.ItemProperties.amount] = amount;
	}

	// Drawing logic
	drawInventory() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const size = drawSize();
		const height = size.height
		const width = size.width;
		const boxSize = size.boxSize;
		const scale = size.scale;
		const padding = size.padding;

		ctx.fillStyle = 'brown';
		ctx.fillRect(0, 0, width * scale, height * scale);
		// Draw boxes
		let pos = {x: 0, y: padding * scale};
		for (let index = 0; index < this.inventory.length; index++) {
			const itemDefIndex = this.itemTypes.findIndex(type => type === this.inventory[index]);
			const item = this.itemDefinitions[itemDefIndex];
			pos.x += boxSize * scale + padding * scale;
			if (index % 5 == 0) {
				// New row
				pos.x = padding * scale;
				if (index != 0) pos.y += boxSize * scale + padding * scale;
			}
			ctx.fillStyle = item[this.ItemProperties.sprite];
			ctx.fillRect(pos.x, pos.y, boxSize * scale, boxSize * scale);
			// Draw image
			if (item[this.ItemProperties.sprite] != 'black') {
				const img = new Image;
				img.src = item[this.ItemProperties.sprite];
				img.onload = function() {
					ctx.drawImage(img, padding * scale, padding * scale, boxSize * scale, boxSize * scale);
				}
			}
		}
	}

	drawItemInspect(item) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const size = drawSize();
		const height = size.height
		const width = size.width;
		const scale = size.scale;
		const padding = size.padding;

		ctx.fillStyle = 'brown';
		ctx.fillRect(padding * scale, padding * scale, width / 2 * scale, height * scale - 2 * padding * scale);
		const img = new Image;
		img.src = item[this.ItemProperties.popupSprite];
		console.log(width, height);
		img.onload = function() {
			ctx.drawImage(img, padding * scale, padding * scale, width / 2 * scale, height * scale - 2 * padding * scale);
		}
	}

}
function drawSize() {
	const boxSize = 16;
	const padding = 4;
	const scale = 4;
	const _width = 5 * boxSize + 6 * padding;
	const _height = 4 * boxSize + 5 * padding;
	return {
		width: _width, 
		height: _height,
		boxSize: boxSize,
		padding: padding,
		scale: scale,
	};
}