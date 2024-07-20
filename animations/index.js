export const createAnimations = (game) => {
	//agregando las animaciones
	game.anims.create({
		key: 'mario-walk',
		frames: game.anims.generateFrameNumbers('mario', { start: 1, end: 3 }),
		frameRate: 12,
		repeat: -1
	});
	game.anims.create({
		key: 'mario-jump',
		frames: [{ key: 'mario', frame: 5 }],
		frameRate: 12
	});
	game.anims.create({
		key: 'mario-idle',
		frames: [{ key: 'mario', frame: 0 }]
	});

	game.anims.create({
		key: 'mario-die',
		frames: [{ key: 'mario', frame: 4 }]
	});
};
