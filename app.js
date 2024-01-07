const app = new PIXI.Application({
    width: 500,
    height: 500,
    transparent: false,
    antialias: false
});

app.renderer.view.style.position = "absolute";

app.renderer.backgroundColor = "#FFFFFF";

document.body.appendChild(app.view);

