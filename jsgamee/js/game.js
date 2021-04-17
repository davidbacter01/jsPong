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

let paddlesY = gameScreen.height/2;
const player1 = new Paddle(30, paddlesY, ctx, {up: 'w', down: 's'}, "#FF0000");
const player2 = new Paddle(740, paddlesY, ctx, {up: 'ArrowUp', down: 'ArrowDown'}, "#0000FF");
const controller = new Controller([player1, player2]);


function animateGame(){
    requestAnimationFrame(animateGame);
    ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
    player1.update();
    player2.update();
}

animateGame();