let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// window.onresize = () => {
//     screenWidth = window.innerWidth;
//     screenHeight = window.innerWidth;
// };

const canvas = document.getElementById("canvas")

canvas.width = screenWidth;
canvas.height = screenHeight;

canvas.addEventListener("click", async () => {
    canvas.requestPointerLock();
});

const ctx = canvas.getContext("2d");

let playerX = 2.5, playerY = 13;
let dirX = 0, dirY = -1;
let planeX = .85, planeY = 0;

let wallColors = {
    1: [128, 0, 128],
    2: [223, 12, 68],
    9: [
        [255, 0, 0],
        [255, 154, 0],
        [208, 222, 33],
        [79, 220, 74],
        [63, 218, 216],
        [47, 201, 226],
        [28, 127, 238],
        [95, 21, 242],
        [186, 12, 248],
        [251, 7, 217]
    ]
};

let rainbowI = 0;
let framesPerRainbowColor = 6;

let time = 0;
let oldTime = 0;
let deltaTime = 0;

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

        // if the wall is hot pink something went wrong
        let color = [255, 105, 180];

        if (map[mapY][mapX] === 9) {
            color = wallColors[map[mapY][mapX]][Math.floor(rainbowI / framesPerRainbowColor)];        
        } else {
            color = wallColors[map[mapY][mapX]];
        }

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

function drawCeilingFloor(ceilingColor, floorColor) {
    // ceiling
    ctx.fillStyle = `#0000ff`;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height / 2);
    ctx.fill();
}

// gameloop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw ceiling and floor
    // drawCeilingFloor();

    // do the magic
    raycast();

    rainbowI++
    if (rainbowI >= wallColors[9].length * framesPerRainbowColor) { rainbowI = 0; }

    movement();
    
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);