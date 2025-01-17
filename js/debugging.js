function gamecubeDebugging() {
    ctx.font = "16px Arial";
    console.log(buttons)
    ctx.fillText(buttons, 10, 25); // buttons used to be an array but now its an object so this dont work
    ctx.fillText(axes[0], 10, 41); // left stick left right
    ctx.fillText(axes[1], 10, 57); // left stick up down
    ctx.fillText(axes[2], 10, 73); // c stick up down
    ctx.fillText(axes[3], 10, 89); // left trigger
    ctx.fillText(axes[4], 10, 105); // right trigger
    ctx.fillText(axes[5], 10, 121); // c stick left right
    ctx.fillText(axes[6], 10, 137); // dpad left right
    ctx.fillText(axes[7], 10, 153); // dpad up down
}
