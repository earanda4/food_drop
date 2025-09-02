const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score-display');
const upgradeDamageBtn = document.getElementById('upgrade-damage');
const upgradeStomachBtn = document.getElementById('upgrade-stomach');

// Game state variables
let player;
let foods = [];
let bullets = [];
let stomachLiningHealth = 100;
let score = 0;
let gameIsOver = false;
let permanentDamageUpgrade = 1;
let permanentStomachUpgrade = 1;

let keys = {
    left: false,
    right: false
};

// Player (Enzyme)
function Enzyme() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 50;
    this.width = 30;
    this.height = 30;
    this.speed = 5;
    this.shootTimer = 0;
    this.shootInterval = 30; // 30 frames between shots (adjust for speed)
}

Enzyme.prototype.draw = function() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

Enzyme.prototype.update = function() {
    // Move left if the left key is pressed
    if (keys.left) {
        this.x -= this.speed;
    }
    // Move right if the right key is pressed
    if (keys.right) {
        this.x += this.speed;
    }

    // Keep the enzyme within the canvas boundaries
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
    }
};

// Food (Enemy)
function Food() {
    this.x = Math.random() * (canvas.width - 50);
    this.y = -50;
    this.width = 40;
