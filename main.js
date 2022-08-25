// canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");


// canvas size
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// variable setting
let backgroundImage, spaceshipImage, enemyImage, bulletImage, gameOverImage;
let gameOver = false;

// score
let score = 0;

// spaceship coordinate
let spaceshipX = canvas.width/2 - 32;
let spaceshipY = canvas.height - 64;


// bullet class
let bulletList = []
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive = true
        bulletList.push(this);
    };
    this.update = function() {
        this.y -= 5;
    };
    this.checkHit = function() {
        for (let i=0;i<enemyList.length;i++) {
            if (
                this.y <= enemyList[i].y && 
                this.x >= enemyList[i].x && 
                this.x <= enemyList[i].x + 40
                ) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
            }
        }
    }
}


// Random number generator
function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}


// enemy class
let enemyList = []
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    };
    this.update = function() {
        this.y += 3; // 적군의 속도 조절

        if (this.y >= canvas.height - 48) {
            gameOver = true;
        }
    };
}


// load images
function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpeg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";  
}


// keyboard setting
let keysDown =  {}
function setupKeyboardListener() {
    document.addEventListener("keydown", function(event){
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.key];
        
        if (event.key == " ") {
            createBullet();
        }
    });
}

// bullet function
// 1. space bar를 누르면 발사
// 2. 총알의 y가 줄어든다.
//    총알의 x는 spaceship의 x
// 3. 발사된 총알을 총알 배열에 저장해서 관리
// 4. 총알들은 각각 x,y 좌표값이 있다.
// 5. 총알 배열들을 render
function createBullet() {
    let b = new Bullet();
    b.init();
}

// enemy fuction
// 1. 1초마다 적군이 생긴다.
// 2. 적군이 바닥에 닿으면 게임 오버
// 3. 적군과 총알이 만나면 적군 사라지고 1점 획득
function createEnemy() {
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000)
}

// update coordinate
function update() {
    // 방향 업데이트
    if ('ArrowRight' in keysDown) {
        spaceshipX += 5;
    }
    if ('ArrowLeft' in keysDown) {
        spaceshipX -= 5;
    }
    if ('ArrowUp' in keysDown) {
        spaceshipY -= 5;
    }
    if ('ArrowDown' in keysDown) {
        spaceshipY += 5;
    }

    // 우주선 업데이트
    if (spaceshipX <= 0) {
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width-64) {
        spaceshipX = canvas.width-64;
    }
    if (spaceshipY <= 0) {
        spaceshipY = 0;
    }
    if (spaceshipY >= canvas.height-64) {
        spaceshipY = canvas.height-64;
    } 

    // 총알 업데이트
    for (let i=0;i<bulletList.length;i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit()
        }
    }

    // 적군 업데이트
    for (let i=0;i<enemyList.length;i++) {
        enemyList[i].update();
    }
}

// render images
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i=0;i<bulletList.length;i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0;i<enemyList.length;i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function main() {
    if (!gameOver) {
        update();
        render();
        requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameOverImage, 50, 100, 300, 350)
    }
}

loadImage()
setupKeyboardListener()
createEnemy()
main()
