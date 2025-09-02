const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
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
    this.height = 40;
    this.speed = 1;
    this.health = 50;
}

Food.prototype.draw = function() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Draw health bar
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y - 10, (this.health / 50) * this.width, 5);
};

// Bullet
function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 8;
    this.damage = 10 * permanentDamageUpgrade;
}

Bullet.prototype.draw = function() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
};

// Game Loop
function gameLoop() {
    if (gameIsOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    player.update();
    player.draw();

    // Update and draw bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        bullet.draw();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Update and draw foods
    foods.forEach((food, index) => {
        food.y += food.speed;
        food.draw();
        if (food.y + food.height >= canvas.height) {
            // Food hit the floor
            stomachLiningHealth -= 10; // Reduce stomach health
            foods.splice(index, 1);
            if (stomachLiningHealth <= 0) {
                endGame();
            }
        }
    });

    // Check for collisions
    bullets.forEach((bullet, bulletIndex) => {
        foods.forEach((food, foodIndex) => {
            // Simple collision detection (AABB)
            if (bullet.x > food.x && bullet.x < food.x + food.width &&
                bullet.y > food.y && bullet.y < food.y + food.height) {
                
                food.health -= bullet.damage;
                bullets.splice(bulletIndex, 1);
                
                if (food.health <= 0) {
                    foods.splice(foodIndex, 1);
                    score += 10;
                }
            }
        });
    });

    // Automatic shooting
    player.shootTimer++;
    if (player.shootTimer >= player.shootInterval) {
        bullets.push(new Bullet(player.x + player.width / 2, player.y));
        player.shootTimer = 0;
    }

    // Spawn new foods (basic wave system)
    if (foods.length < 5) {
        if (Math.random() < 0.01) { // 1% chance to spawn food each frame
            foods.push(new Food());
        }
    }

    // Draw stomach lining health bar
    ctx.fillStyle = 'brown';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = 'chocolate';
    ctx.fillRect(0, canvas.height - 20, (stomachLiningHealth / (100 * permanentStomachUpgrade)) * canvas.width, 20);

    requestAnimationFrame(gameLoop);
}

// Game Over
function endGame() {
    gameIsOver = true;
    scoreDisplay.textContent = `Your score: ${score}`;
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';
}

// Start the game
function startGame() {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameIsOver = false;
    player = new Enzyme();
    foods = [];
    bullets = [];
    stomachLiningHealth = 100 * permanentStomachUpgrade;
    score = 0;
    gameLoop();
}

// Handle upgrades
upgradeDamageBtn.addEventListener('click', () => {
    permanentDamageUpgrade++;
    startGame();
});

upgradeStomachBtn.addEventListener('click', () => {
    permanentStomachUpgrade++;
    stomachLiningHealth = 100 * permanentStomachUpgrade;
    startGame();
});

// Handle user input
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
});

// Initial setup to show the start menu
function initializeGame() {
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startMenu.style.display = 'flex';
}

startButton.addEventListener('click', () => {
    startMenu.style.display = 'none';
    startGame();
});

initializeGame();
