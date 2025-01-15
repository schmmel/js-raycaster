let keys = {};
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

let mouseMovementX = 0;
document.addEventListener("mousemove", (e) => { mouseMovementX = e.movementX; });

let gamecubeButtons = ["X", "A", "B", "Y", "Left Trigger", "Right Trigger", null, "Z", null, "Start", null, null, "Up", "Right", "Down", "Left"]

window.addEventListener("gamepadconnected", (e) => { controller = e.gamepad; });
window.addEventListener("gamepaddisconnected", (e) => { controller = {}; })
let controller = {};
let buttons = [];
let axes = [];

function gamepadUpdateHandler() {
    buttons = [];
    axes = [];

    if (controller.buttons) {
        for (let i = 0; i < controller.buttons.length; i++) {
            if (controller.buttons[i].pressed) {
                buttons.push(gamecubeButtons[i]);
            }
        }
        ctx.font = "16px Arial";
        ctx.fillText(buttons, 10, 25)
    }

    if (controller.axes) {
        ctx.fillText(controller.axes[0], 10, 41); // left stick left right
        ctx.fillText(controller.axes[1], 10, 57); // left stick up down
        ctx.fillText(controller.axes[2], 10, 73); // c stick up down
        ctx.fillText(controller.axes[3], 10, 89); // left trigger
        ctx.fillText(controller.axes[4], 10, 105); // right trigger
        ctx.fillText(controller.axes[5], 10, 121); // c stick left right
        ctx.fillText(controller.axes[6], 10, 137); // dpad left right
        ctx.fillText(controller.axes[7], 10, 153); // dpad up down
    }
    // console.log(buttonsPressed);
}

function movement() {
    gamepadUpdateHandler()

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

    if ((keys["KeyW"] && keys["KeyA"] && !keys["KeyD"]) ||
        (keys["KeyW"] && keys["KeyD"] && !keys["KeyA"]) ||
        (keys["KeyS"] && keys["KeyA"] && !keys["KeyD"]) ||
        (keys["KeyS"] && keys["KeyD"] && !keys["KeyA"])) {
        moveSpeed = moveSpeed * diagonalPenalty;
    }

    if (keys["KeyW"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX + dirX * moveSpeed)] === 0) { playerX += dirX * moveSpeed; }
        if (map[Math.floor(playerY + dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY += dirY * moveSpeed; }
    }

    if (keys["KeyS"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX - dirX * moveSpeed)] === 0) { playerX -= dirX * moveSpeed; }
        if (map[Math.floor(playerY - dirY * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirY * moveSpeed; }
    }

    if (keys["KeyA"]) {
        if (map[Math.floor(playerY)][Math.floor(playerX + dirY * moveSpeed)] === 0) { playerX += dirY * moveSpeed; }
        if (map[Math.floor(playerY - dirX * moveSpeed)][Math.floor(playerX)] === 0) { playerY -= dirX * moveSpeed; }
    }

    if (keys["KeyD"]) {
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

    // if () {
        
    // }
}