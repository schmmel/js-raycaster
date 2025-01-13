let keys = {};
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

let mouseMovementX = 0;
document.addEventListener("mousemove", (e) => { mouseMovementX = e.movementX});

function movement() {
    // get delta time
    oldTime = time;
    time = Date.now();
    deltaTime = (time - oldTime) / 1000;

    let moveSpeed = deltaTime * 5;
    let rotateSpeed = deltaTime * 2.5;
    // multiplying moveSpeed by diagonalPenalty results in the distance traveled diagonally to be the same as going straight because pythagoras theory
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

    console.log(mouseMovementX)
    // divided by 100 because raw values would be far too high
    // also fixes mouseMovementX sometimes getting stuck at a non 0 value when you stop moving the mouse by repeatedly dividing the value
    mouseMovementX = mouseMovementX / 100

    if (mouseMovementX > 0 && document.pointerLockElement) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(mouseMovementX) - dirY * Math.sin(mouseMovementX);
        dirY = oldDirX * Math.sin(mouseMovementX) + dirY * Math.cos(mouseMovementX);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(mouseMovementX) - planeY * Math.sin(mouseMovementX);
        planeY = oldPlaneX * Math.sin(mouseMovementX) + planeY * Math.cos(mouseMovementX);
    }

    if (mouseMovementX < 0 && document.pointerLockElement) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(mouseMovementX) - dirY * Math.sin(mouseMovementX);
        dirY = oldDirX * Math.sin(mouseMovementX) + dirY * Math.cos(mouseMovementX);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(mouseMovementX) - planeY * Math.sin(mouseMovementX);
        planeY = oldPlaneX * Math.sin(mouseMovementX) + planeY * Math.cos(mouseMovementX);
    }
}