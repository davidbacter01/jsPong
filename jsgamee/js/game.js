gameScreen = document.getElementById('gameScreen');
gameScreen.width  = 800;
gameScreen.height = 600;
ctx = gameScreen.getContext('2d');


class Paddle {
    constructor(x, y, ctx, keyCodes, color){
        this.maxSpeed = 6;
        this.color = color;
        this.speed = 0;
        this.x = x;
        this.y = y - 50;
        this.ctx = ctx;
        this.height = 100;
        this.width = 30;
        this.controlKeys = keyCodes;
    }

    moveUp(){
        this.speed = -this.maxSpeed;
    }

    moveDown(){
        this.speed = this.maxSpeed;
    }

    stop(){
        this.speed = 0;
    }

    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width,this.height);        
    }

    update(){
        this.y += this.speed;
        if (this.y < 0){
            this.y = 0;
        }
        if (this.y > gameScreen.height - this.height){
            this.y = gameScreen.height - this.height;
        }
        this.draw();
    }
}

class Controller {
    constructor(players){
        this.players = players;
        addEventListener("keydown", (ev)=>{
            this.players.forEach(player => {
                if (ev.key == player.controlKeys.up){
                    player.moveUp();
                }
                if (ev.key == player.controlKeys.down){
                    player.moveDown();
                }
            });            
        });

        addEventListener("keyup", (ev)=>{
            this.players.forEach(player => {
                if (ev.key == player.controlKeys.up && player.speed < 0){
                    player.stop();
                }
                else if (ev.key == player.controlKeys.down && player.speed > 0){
                    player.stop();
                }
            });
            
            delete keysPressed[ev.key];            
        });
    }
}

class Ball {
    constructor(x, y, radius, ctx, p1, p2){
        this.color = '#00FF00'
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.speed = {x: 3, y: 3};
        this.p1 = p1;
        this.p2 = p2;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0 ,2 * Math.PI);
        this.ctx.fillStyle = this.color
        this.ctx.fill()
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        // detect walls collision
        if (this.y - this.radius < 0 || this.y + this.radius > gameScreen.height){
            this.speed.y = -this.speed.y;
        }
        if (this.x - this.radius < 0 || this.x + this.radius > gameScreen.width){
            this.speed.x = -this.speed.x;
        }

        // detect players collision
        if (this.y >= this.p1.y && this.y <= this.p1.y + this.p1.height){
            if (this.x - this.radius < this.p1.x + this.p1.width){
                this.speed.x = -this.speed.x;
            }
        }

        if (this.y >= this.p2.y && this.y <= this.p2.y + this.p2.height){
            if (this.x + this.radius > this.p2.x){
                this.speed.x = -this.speed.x;
            }
        }

        this.draw();
    }
}


let paddlesY = gameScreen.height/2;
const player1 = new Paddle(30, paddlesY, ctx, {up: 'w', down: 's'}, "#FF0000");
const player2 = new Paddle(740, paddlesY, ctx, {up: 'ArrowUp', down: 'ArrowDown'}, "#0000FF");
const controller = new Controller([player1, player2]);
const ball = new Ball(gameScreen.width/2, gameScreen.height/2, 20, ctx, player1, player2);


function animateGame(){
    requestAnimationFrame(animateGame);
    ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
    player1.update();
    player2.update();
    ball.update();
}

animateGame();