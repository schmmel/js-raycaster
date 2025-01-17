let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// window.onresize = () => {
//     screenWidth = window.innerWidth;
//     screenHeight = window.innerWidth;
// };

const canvas = document.getElementById("canvas");

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

loadImages();

requestAnimationFrame(loop);