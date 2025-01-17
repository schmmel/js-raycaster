let keys = {};
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

let mouseMovementX = 0;
document.addEventListener("mousemove", (e) => { mouseMovementX = e.movementX; });

window.addEventListener("gamepadconnected", (e) => { controller = e.gamepad; });
window.addEventListener("gamepaddisconnected", (e) => { controller = null })

let gamecubeButtons = ["X", "A", "B", "Y", "Left Trigger", "Right Trigger", null, "Z", null, "Start", null, null, "Up", "Right", "Down", "Left"]

let controller = null;
let buttons = {};
let axes = [];

let leftStickDeadzone = .25;
let cStickDeadzone = .05;

function gamepadUpdateHandler() {
    // gamecubeDebugging();

    buttons = {};
    axes = [];

    if (controller.buttons) {
        for (let i = 0; i < controller.buttons.length; i++) {
            if (controller.buttons[i].pressed) {
                buttons[gamecubeButtons[i]] = gamecubeButtons[i];
            }
        }
    }

    if (controller.axes) {
        for (let i = 0; i < controller.axes.length; i++) {
            axes[i] = controller.axes[i]
        }
    }

}

function movement() {
    // get delta time
    oldTime = time;
    time = Date.now();
    deltaTime = (time - oldTime) / 1000;

    let moveSpeed = deltaTime * 5;

    // for arrow key rotation only
    // let rotateSpeed = deltaTime * 2.5;

    // multiplying moveSpeed by diagonalPenalty results in the distance traveled diagonally to be the same as going straight because pythagoras theory
    // value might need to be adjusted if i change moveSpeed
    let diagonalPenalty = 0.708;

    let directions = {};

    if (keys["KeyW"] || buttons["Up"] || axes[1] < -leftStickDeadzone) { directions["forward"] = 1; }
    if (keys["KeyS"] || buttons["Down"] || axes[1] > leftStickDeadzone) { directions["backward"] = 1; }
    if (keys["KeyA"] || buttons["Left"] || axes[0] < -leftStickDeadzone) { directions["left"] = 1; }
    if (keys["KeyD"] || buttons["Right"] || axes[0] > leftStickDeadzone) { directions["right"] = 1; }

    if ((directions["forward"] && directions["left"] && !directions["right"]) ||
        (directions["forward"] && directions["right"] && !directions["left"]) ||
        (directions["backward"] && directions["left"] && !directions["right"]) ||
        (directions["backward"] && directions["right"] && !directions["left"])) {
        moveSpeed = moveSpeed * diagonalPenalty;
    }

    if (directions["forward"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX + dirX * moveSpeed)] === 0) { playerX += dirX * moveSpeed; }
        if (map[Math.floor(playerY + dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY += dirY * moveSpeed; }
    }

    if (directions["backward"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirX * moveSpeed)] === 0) { playerX -= dirX * moveSpeed; }
        if (map[Math.floor(playerY - dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirY * moveSpeed; }
    }

    if (directions["left"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX + dirY * moveSpeed)] === 0) { playerX += dirY * moveSpeed; }
        if (map[Math.floor(playerY - dirX * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirX * moveSpeed; }
    }

    if (directions["right"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirY * moveSpeed)] === 0) { playerX -= dirY * moveSpeed; }
        if (map[Math.floor(playerY + dirX * moveSpeed)][Math.floor(playerX)] === 0) { playerY += dirX * moveSpeed; }
    }

    // if (keys["ArrowLeft"]) {
    //     let oldDirX = dirX;
    //     dirX = dirX * Math.cos(-rotateSpeed) - dirY * Math.sin(-rotateSpeed);
    //     dirY = oldDirX * Math.sin(-rotateSpeed) + dirY * Math.cos(-rotateSpeed);
    //     let oldPlaneX = planeX;
    //     planeX = planeX * Math.cos(-rotateSpeed) - planeY * Math.sin(-rotateSpeed);
    //     planeY = oldPlaneX * Math.sin(-rotateSpeed) + planeY * Math.cos(-rotateSpeed);
    // }

    // if (keys["ArrowRight"]) {
    //     let oldDirX = dirX;
    //     dirX = dirX * Math.cos(rotateSpeed) - dirY * Math.sin(rotateSpeed);
    //     dirY = oldDirX * Math.sin(rotateSpeed) + dirY * Math.cos(rotateSpeed);
    //     let oldPlaneX = planeX;
    //     planeX = planeX * Math.cos(rotateSpeed) - planeY * Math.sin(rotateSpeed);
    //     planeY = oldPlaneX * Math.sin(rotateSpeed) + planeY * Math.cos(rotateSpeed);
    // }

    // divided by 100 because raw values would be far too high
    // also fixes mouseMovementX sometimes getting stuck at a non 0 value when you stop moving the mouse
    mouseMovementX = mouseMovementX / 100

    if (mouseMovementX !== 0 && document.pointerLockElement) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(mouseMovementX) - dirY * Math.sin(mouseMovementX);
        dirY = oldDirX * Math.sin(mouseMovementX) + dirY * Math.cos(mouseMovementX);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(mouseMovementX) - planeY * Math.sin(mouseMovementX);
        planeY = oldPlaneX * Math.sin(mouseMovementX) + planeY * Math.cos(mouseMovementX);
    }

    if (controller) {
        gamepadUpdateHandler()

        // axes[5] = c stick left right
        if (axes[5] >= cStickDeadzone || axes[5] <= -cStickDeadzone) {
            let cMovement = axes[5] / 8;
            let oldDirX = dirX;
            dirX = dirX * Math.cos(cMovement) - dirY * Math.sin(cMovement);
            dirY = oldDirX * Math.sin(cMovement) + dirY * Math.cos(cMovement);
            let oldPlaneX = planeX;
            planeX = planeX * Math.cos(cMovement) - planeY * Math.sin(cMovement);
            planeY = oldPlaneX * Math.sin(cMovement) + planeY * Math.cos(cMovement);
        }
    }
}