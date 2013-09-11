/**
 * Application controller
 * @constructor
 */
function BB_App() {
	var self = this;
	this.resize();
	this.drawer = new BB_Drawer().resize();
	this.storage = new BB_Storage(BB_Game.maps.length);
	this.sprite = new BB_Sprite().render(this.ctx, this.scale);
	this.game = this.storage.getLevel();
	this.sound = new BB_Sound(function() {
		switch (this.index) {
			case -1:
			case 3:
				self.scene.on('load');
				break;
			case 4:
				self.scene.on('music');
				break;
		}
	});
	this.sound.disabled = !this.storage.getSound();
	this.scene = new BB_Main(this);
	document.body.appendChild(self.drawer.canvas);
	document.body.appendChild(self.canvas);
	self.bind();
}

/**
 * Extends CP_Canvas
 */
BB_App.prototype = new CP_Canvas(480, 320);

/**
 * Event handler
 * @param e
 */
BB_App.prototype.on = function(e) {
	this.scene.on(e, this.x, this.y, this.touch);
};

/**
 * Draw the canvas
 */
BB_App.prototype.paint = function() {
	this.scene.paint(this.ctx);
	this.scene.run();
};

/**
 * Start new level
 * @param {Number} add
 */
BB_App.prototype.start = function(add) {
	if (add) {
		this.game += add;
	}
	delete this.scene;
	this.scene = new BB_Game(this, this.game);
};

/**
 * Animation thread
 */
BB_App.prototype.run = function() {
	var self = this;
	self.paint();
	requestAnimFrame(function() {
		self.run();
	});
};

window.requestAnimFrame =
	window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function(callback) { window.setTimeout(callback, 1000 / 60); };

window.onload = function() {
	window.scrollTo(0, 1);
	setTimeout(function() {
		new BB_App().run();
	}, 1000);
};