let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// window.onresize = () => {
//     screenWidth = window.innerWidth;
//     screenHeight = window.innerWidth;
// };

const canvas = document.createElement("canvas");
document.body.append(canvas);

canvas.width = screenWidth;
canvas.height = screenHeight;

const ctx = canvas.getContext("2d");

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 2, 2, 2, 1],
    [1, 2, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

let playerX = 2.5, playerY = 3;
let dirX = 0, dirY = -1;
let planeX = .85, planeY = 0;

let wallColors = {
    1: [128, 0, 128],
    2: [223, 12, 68]
};

let time = 0;
let oldTime = 0;
let deltaTime = 0;

let keys = {};
document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function raycast() {
    for (let x = 0; x < screenWidth; x++) {
        let cameraX = 2 * x / screenWidth - 1;

        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(playerX);
        let mapY = Math.floor(playerY);

        let sideDistX;
        let sideDistY;

        let deltaDistX = Math.abs(1 / rayDirX);
        let deltaDistY = Math.abs(1 / rayDirY);

        let perpWallDist;

        let stepX;
        let stepY;

        let hit = 0;
        let side;

        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (playerX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - playerX) * deltaDistX;
        };

        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (playerY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - playerY) * deltaDistY;
        };

        while (hit === 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }

            if (map[mapY][mapX] > 0) {
                hit = 1;
            }
        }

        if (side === 0) {
            perpWallDist = sideDistX - deltaDistX;
        } else {
            perpWallDist = sideDistY - deltaDistY;
        }

        lineHeight = screenHeight / perpWallDist;

        drawStart = -lineHeight / 2 + screenHeight / 2;
        drawEnd = lineHeight / 2 + screenHeight / 2;

        if (drawStart < 0) { drawStart = 0; };
        if (drawEnd >= screenHeight) { drawEnd = screenHeight - 1; };

        let color = wallColors[map[mapY][mapX]];

        // slightly darker colors on walls one of the axes
        if (side === 1) {
            color = [color[0] * 0.80, color[1] * 0.80, color[2] * 0.80]
        }

        drawLine(x, drawStart, drawEnd, color);

        // console.log(lineHeight)
    }
}

function drawLine(x, y1, y2, color) {
    ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
}

function movement() {
    // get delta time
    oldTime = time;
    time = Date.now();
    deltaTime = (time - oldTime) / 1000;

    let moveSpeed = deltaTime * 5;
    let rotateSpeed = deltaTime * 2;

    if (keys["w"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX + dirX * moveSpeed)] === 0) { playerX += dirX * moveSpeed; }
        if (map[Math.floor(playerY + dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY += dirY * moveSpeed; }
    }

    if (keys["s"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirX * moveSpeed)] === 0) { playerX -= dirX * moveSpeed; }
        if (map[Math.floor(playerY - dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirY * moveSpeed; }
    }

    if (keys["a"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirX * moveSpeed)] === 0) { playerX += dirY * moveSpeed; }
        if (map[Math.floor(playerY - dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirX * moveSpeed; }
    }

    if (keys["d"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirX * moveSpeed)] === 0) { playerX -= dirY * moveSpeed; }
        if (map[Math.floor(playerY - dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY += dirX * moveSpeed; }
    }

    if (keys["ArrowLeft"]) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(-rotateSpeed) - dirY * Math.sin(-rotateSpeed);
        dirY = oldDirX * Math.sin(-rotateSpeed) + dirY * Math.cos(-rotateSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotateSpeed) - planeY * Math.sin(-rotateSpeed);
        planeY = oldPlaneX * Math.sin(-rotateSpeed) + planeY * Math.cos(-rotateSpeed);
    }

    if (keys["ArrowRight"]) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(rotateSpeed) - dirY * Math.sin(rotateSpeed);
        dirY = oldDirX * Math.sin(rotateSpeed) + dirY * Math.cos(rotateSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotateSpeed) - planeY * Math.sin(rotateSpeed);
        planeY = oldPlaneX * Math.sin(rotateSpeed) + planeY * Math.cos(rotateSpeed);
    }
}

// gameloop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // do the magic
    raycast();

    movement();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);