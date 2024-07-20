import { createAnimations } from './animations/index.js';

// crear configuracion de juegos con phaser
const config = {
	type: Phaser.AUTO,
	width: 256,
	height: 244,
	backgroundColor: '#049cd8',
	parent: 'game',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 300
			},
			default: false
		}
	},
	scene: {
		preload, // se ejecuta antes de crear el juego para cargar recursos
		create, // se ejecuta cuando se crea el juego
		update // se ejecuta en cada frame, actualiza el juego
	}
};

new Phaser.Game(config); // iniciar el juego

function preload() {
	this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png');
	this.load.spritesheet('mario', 'assets/entities/mario.png', {
		frameWidth: 18,
		frameHeight: 16
	});
	this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png');

	//agregando las teclas
	this.keys = this.input.keyboard.createCursorKeys();

	// agregando la musica de game over
	this.load.audio('gameover', 'assets/sound/music/gameover.mp3');
}

function create() {
	// agregar imagen, posicion del eje x, posicion del eje y , nombre de la imagen
	this.add
		.image(0, 0, 'cloud1')
		// indicar de donde empezar a tomar la imagen, por defecto (0.5,0.5)
		.setOrigin(0, 0)
		//y la escalar
		.setScale(0.15);

	// crear un grupo statico para el suelo
	this.floor = this.physics.add.staticGroup();
	// agregar imagen del suelo al grupo statico, se usa refresh body para actualizar physics de los objetos staticos
	this.floor
		.create(0, config.height - 16, 'floorbricks')
		.setOrigin(0, 0.5)
		.refreshBody();
	this.floor
		.create(150, config.height - 16, 'floorbricks')
		.setOrigin(0, 0.5)
		.refreshBody();

	/* 
de esta manera se hacia antes de agregar el suelo al grupo statico

	this.add
		// posicion del eje x, posicion del eje y incial, ancho, alto
		.tileSprite(0, config.height, config.width, 32, 'floorbricks')
		.setOrigin(0, 1);
		 */

	// cuando se agerga gravedad se canmbia la forma de crear el objeto
	// this.mario = this.add.sprite(100, 200, 'mario');

	this.mario = this.physics.add
		.sprite(50, 100, 'mario')
		.setOrigin(0, 1)
		.setCollideWorldBounds(true)
		.setGravityY(300);
	// .gravity(1000)

	// agregamos colllisiones entre el piso y e mario
	this.physics.add.collider(this.mario, this.floor);
	// definimos los limites el mundo
	this.physics.world.setBounds(0, 0, 2000, config.height);

	// agregamos la camara y definimos sus limites
	this.cameras.main.setBounds(0, 0, 2000, config.height);
	// decimos a que objeto debe seguir la camara
	this.cameras.main.startFollow(this.mario);

	// agregamos las animaciones
	createAnimations(this);
}

function update() {
	if (this.mario.isDead) return;
	if (this.keys.left.isDown) {
		this.mario.anims.play('mario-walk', true);
		this.mario.flipX = true;
		this.mario.x += -2;
	} else if (this.keys.right.isDown) {
		this.mario.anims.play('mario-walk', true);
		this.mario.flipX = false;
		this.mario.x += 2;
	} else {
		// this.mario.anims.stop();
		// this.mario.setFrame(0);
		this.mario.anims.play('mario-idle');
	}

	if (this.keys.up.isDown && this.mario.body.touching.down) {
		// esta linea solo cambia la posicion y se ve que el personaje se teleporta
		// this.mario.y -= 2;

		// para darle una aniumacion al salto se le pone un velocidad al eje y que trabaja con la graedad especificada
		this.mario.setVelocityY(-300);
		this.mario.anims.play('mario-jump', true);
	}

	// ver si mario toco el borde inferior oara moriri

	if (this.mario.y >= config.height) {
		this.mario.isDead = true;
		this.mario.anims.play('mario-die');
		this.mario.setCollideWorldBounds(false);
		// this.sound.play('gameover');
		this.sound.add('gameover', { volume: 0.2 }).play();
		setTimeout(() => {
			this.mario.setVelocityY(-350);
		}, 100);

		setTimeout(() => {
			this.scene.restart();
		}, 2000);
	}
}
