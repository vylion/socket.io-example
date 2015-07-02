var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)
//var KeyboardJS = require('./KeyboardJS.js')

var debug = true;
var preventer = function (evt) {
//if (condition) evt.preventDefault();
};

var keyboard = new KeyboardJS(debug, preventer);

// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.WebGLRenderer(800, 600);

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();
stage.alpha = 0.9;
renderer.backgroundColor = 0xFFFFFF;

// This creates a texture from a 'bunny.png' image.
var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
var bunny = new PIXI.Sprite(bunnyTexture);
global.bunny = bunny
bunny.tint = Math.floor(Math.random()*16777215)
var bunnies = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// kick off the animation loop (defined below)
animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
		
		if(keyboard.char('W')) {
			bunny.position.y -= 2;
			var info = bunny.position
			info.color = bunny.tint
			socket.emit('update_position', info)
		}
		if (keyboard.char('S')) {
			bunny.position.y += 2
			var info = bunny.position
			info.color = bunny.tint
			socket.emit('update_position', info)
		}
		if (keyboard.char('A')) {
			bunny.position.x -= 2
			var info = bunny.position
			info.color = bunny.tint
			socket.emit('update_position', info)
		}
		if (keyboard.char('D')) {
			bunny.position.x += 2
			var info = bunny.position
			info.color = bunny.tint
			socket.emit('update_position', info)
		}
		
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

socket.on('connect', function () {
  console.log('connected')
	var info = bunny.position
	info.color = bunny.tint
  socket.emit('update_position', info)
})

socket.on('init_position', function (people) {
	for (var key in people) {
		sprite = new PIXI.Sprite(bunnyTexture)
		stage.addChild(sprite)
		bunnies[people[key].id] = sprite
		sprite.tint = people[key].color
		sprite.anchor.set(0.5, 0.5)
		sprite.position.x = people[key].x
		sprite.position.y = people[key].y
	}
	console.log('Initialized all bunnies')
	// Add the bunny to the scene we are building.
	stage.addChild(bunny);
})

socket.on('update_position', function (info) {
	var sprite = bunnies[info.id]
	if(!sprite) {
		sprite = new PIXI.Sprite(bunnyTexture)
		stage.addChild(sprite)
		bunnies[info.id] = sprite
		sprite.tint = info.color
		sprite.anchor.set(0.5, 0.5)
	}
	console.log(info)
	sprite.position.x = info.x
	sprite.position.y = info.y
})

socket.on('rm_position', function (info) {
	stage.removeChild(bunnies[info.id])
	delete bunnies[info.id]
	console.log('Removed bunny', info.id)
})

//coins[i])

// npm install --save browserify
//
// npm run <script-name>
// npm run buildi
//
// node index.js
// http-server . <-p port>
