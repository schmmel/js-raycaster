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
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

let playerX = 3, playerY = 3;
let dirX = .5, dirY = .5;
let planeX = 0, planeY = (2 / 3);

let wallColor = [128, 0, 128]

let time = 0;
let oldTime = 0;

function raycast() {
    for (let x = 0; x < screenWidth; x++) {
        let cameraX = 2 * x / screenWidth - 1;

        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = playerX;
        let mapY = playerY;

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

        if (drawStart < 0) { drawStart = 0; }
        if (drawEnd >= screenHeight) { drawEnd = screenHeight - 1; }

        // slightly darker colors on walls on the y(?) axis
        let color = wallColor;
        if (side === 1) {
            color = [color[0] * 0.85, color[1] * 0.85, color[2] * 0.85]
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

// gameloop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // do the magic
    raycast();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);