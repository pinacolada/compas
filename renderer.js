"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_1 = require("./display");
const ui_1 = require("./ui");
let stage = new display_1.Stage(1024, 600, 0x9999FF);
var carre = new display_1.Sprite();
carre.name = "carré";
stage.addChild(carre);
carre.setRect(150, 50, 250, 250);
carre.setBackground(0x00CC00, 0.5);
const gr = carre.graphics;
gr.moveTo(carre.width, 0);
gr.lineStyle(2, 0x000000, 1);
gr.lineTo(carre.width, carre.height);
gr.lineTo(0, carre.height);
gr.lineStyle(2, 0xFFFFFF, 1);
gr.lineTo(0, 0);
gr.lineTo(carre.width, 0);
gr.lineStyle(); // pas de bordure
gr.beginFill(0xFF0000, 1);
gr.drawCircle(20, 20, 15);
gr.beginFill(0xFF00FF, 1);
gr.drawPolygon(100, 50, 100, 100, 50, 100, 50, 150, 100, 150, 100, 200, 150, 200, 150, 150, 200, 150, 200, 100, 150, 100, 150, 50);
gr.lineStyle(3, 0x000099, 1); // retour de la bordure
gr.beginFill(0xFFFF00, 0.6);
gr.drawEllipse(130, 80, 80, 50);
stage.graphics.lineStyle(1, 0x000000, 1);
stage.graphics.beginFill(0xCC9966, 1);
stage.graphics.drawPolygon(100, 10, 40, 198, 190, 78, 10, 78, 160, 198);
stage.graphics.lineStyle(1, 0x666699, 0.5);
for (let i = 0; i < stage.width; i += 50) {
    stage.graphics.moveTo(i, 0);
    stage.graphics.lineTo(i, stage.height);
}
for (let j = 0; j < stage.height; j += 50) {
    stage.graphics.moveTo(0, j);
    stage.graphics.lineTo(stage.width, j);
}
const btn = new ui_1.Button("btn", 735, 522, 200, 40, 0x666666, "Créer un élément", 2);
btn.addEventListener("click", createElement);
stage.addChild(btn);
let currentSprite;
const fram = new display_1.Sprite();
fram.setBorder(1, 0xFF0000, 0.6, "dotted");
const grid = new ui_1.DisplayGrid();
var numCurrent = 1;
stage.el.addEventListener("keydown", (e) => {
    console.log(e);
    if (currentSprite == null)
        return;
    if (e.key === "Delete") {
        currentSprite.removeChild(grid);
        stage.removeChild(currentSprite);
        currentSprite = null;
    }
    else if (e.key === "ArrowUp") {
        e.shiftKey ? currentSprite.height-- : currentSprite.y--;
    }
    else if (e.key === "ArrowDown") {
        e.shiftKey ? currentSprite.height++ : currentSprite.y++;
    }
    else if (e.key === "ArrowLeft") {
        e.shiftKey ? currentSprite.width-- : currentSprite.x--;
    }
    else if (e.key === "ArrowRight") {
        e.shiftKey ? currentSprite.width++ : currentSprite.x++;
    }
    if (currentSprite)
        grid.ajustTo(currentSprite);
});
function createElement(d, e) {
    if (stage.cursor != "default")
        return;
    stage.cursor = "crosshair ";
    stage.el.addEventListener("mousedown", startDrag);
    function startDrag(e) {
        if (stage.cursor != "crosshair")
            return;
        stage.cursor = "se-resize";
        stage.el.removeEventListener("mousedown", startDrag);
        stage.el.addEventListener("mouseup", endDrag);
        stage.el.addEventListener("mousemove", drag);
        fram.setRect(e.clientX, e.clientY, 0, 0);
        stage.addChild(fram);
    }
    function drag(e) {
        if (stage.cursor != "se-resize")
            return;
        fram.width = e.clientX - fram.x;
        fram.height = e.clientY - fram.y;
    }
    function endDrag(e) {
        if (stage.cursor != "se-resize")
            return;
        if (fram.width == 0 && fram.height == 0)
            return;
        stage.el.removeEventListener("mouseup", endDrag);
        stage.el.removeEventListener("mousemove", drag);
        if (fram.rect.width > 0 && fram.rect.height > 0) {
            let el = new display_1.Sprite();
            el.name = "item_" + numCurrent++;
            el.setRectAs(fram.rect);
            el.setBackground(0xFFFFFF, 1.0);
            el.setBorder(1, 0x000000, 1.0, "solid");
            stage.addChild(el);
            setCurrentSprite(el);
            el.addEventListener("mousedown", () => setCurrentSprite(el));
        }
        stage.removeChild(fram);
        stage.cursor = "default";
    }
}
function setCurrentSprite(el) {
    currentSprite = el;
    if (currentSprite) {
        currentSprite.addChild(grid);
        grid.ajustTo(currentSprite);
    }
}
//# sourceMappingURL=renderer.js.map