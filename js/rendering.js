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

        let sprite = {};

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

            if (sprites[mapY]?.[mapX]) {
                sprite.name = sprites[mapY][mapX];
                sprite.y = mapY;
                sprite.x = mapX;
            }

            if (map[mapY][mapX] != 0) {
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

        if (sprite.name) {
            drawSprite(sprite)
        }


        // console.log(lineHeight)
    }
}

function loadImages() {
    // this.textureImageDatas = []
    // this.texturesLoadedCount = 0
    // this.texturesLoaded = false

    let images = [
        { "id": "barrel", "src": "img/barrel.png" },
    ];

    let divTextures = document.getElementById("textures")

    for (let i = 0; i < images.length; i++) {
        let src = images[i].src;
        let img = document.createElement("img")
        img.id = images[i].id
        divTextures.appendChild(img)
        img.src = src
    }

    // let this2 = this

    // img.onload = function () {
    //     console.log("img src loaded " + img.src)

    //     // Draw images on this temporary canvas to grab the ImageData pixels
    //     let canvas = document.createElement('canvas');
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     let context = canvas.getContext('2d')
    //     context.drawImage(img, 0, 0, img.width, img.height)
    //     console.log(imageconf.id + " size = (" + img.width + ", " + img.height + ")")

    //     // Assign ImageData to a variable with same name as imageconf.id
    //     this2[imageconf.id] = context.getImageData(0, 0, img.width, img.height)

    //     this2.texturesLoadedCount++
    //     this2.texturesLoaded = this2.texturesLoadedCount == this2.imageconf.length
    // };
}

function drawSprite(sprite) {
    // texture = document.getElementById(sprite.name)
    ctx.font = "16px Arial";
    ctx.fillText(`${sprite.y}, ${sprite.x}`, sprite.y * 30 - 20, sprite.x * 25);
}

function drawLine(x, y1, y2, color) {
    ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
}

// for some reason the walls are semi transparent so these show up through them
function drawCeilingFloor(ceilingColor, floorColor) {
    // ceiling
    ctx.fillStyle = `#0000ff`;
    // ctx.globalCompositeOperation='destination-over';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height / 2);
    ctx.fill();
}