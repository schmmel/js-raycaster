let screenWidth = 640;
let screenHeight = 480;

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
let dirX = -1, dirY = 0;
let planeX = 0, planeY = (2/3);

let time = 0;
let oldTime = 0;

function raycast() {
    for (let x = 0; x < screenWidth; x++) {
        let cameraX = 2 * x / screenWidth - 1     
        console.log(cameraX);
    }
}

raycast();