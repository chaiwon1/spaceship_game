// canvas setting
let canvas;
let ctx;

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")


// canvas size
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas)


// variable setting
let backgroundImage, spaceshipImage, enemyImage, bulletImage, gameOverImage;

// spaceship coordinate
let spaceshipX = canvas.width/2 - 32
let spaceshipY = canvas.height - 64

// bullet class
let bulletList = []
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 20
        this.y = spaceshipY

        bulletList.push(this)
    }
    this.update = function() {
        this.y -= 5;
    }
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
    gameOverImage.src = "images/gameover.jpeg";  
}

// keyboard setting
let keysDown =  {}
function setupKeyboardListener() {
    document.addEventListener("keydown", function(event){
        keysDown[event.key] = true
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.key]
        
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
        bulletList[i].update()
    }
}

// render images
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    for(let i=0;i<bulletList.length;i++) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
    }
}

function main() {
    update();
    render();
    requestAnimationFrame(main);
}

loadImage()
setupKeyboardListener()
main()
