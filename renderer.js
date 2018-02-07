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
let hsl = new ui_1.HSLColorPicker("hsl", stage, 25, 310, 0xFF00FF);
hsl.callback = changeColor;
let rp = new ui_1.RGBColorPicker("rgb", stage, 125, 310, 0x336699);
rp.callback = changeColor;
const bCreEl = new ui_1.Button("cre", stage, 735, 70, 150, 40, 0x666666, "Créer un élément");
bCreEl.addListener("click", createElement);
let alpha = new ui_1.Slider("alpha", stage, 25, 550, 200, 1, 0, 1, true);
alpha.gradientBackground([0x000000, 0x000000], [0, 1], [0, 255], 90);
alpha.addListener("change", () => changeAlpha(alpha));
let currentSprite;
const fram = new display_1.Sprite();
fram.setBorder(1, 0xFF0000, 0.6, "dotted");
const grid = new ui_1.ResizerGrid();
let numCurrent = 1;
stage.addListener("keydown", (s, e) => {
    if (currentSprite == null)
        return;
    if (e.key === "Delete") {
        currentSprite.removeChild(grid);
        s.removeChild(currentSprite);
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
        grid.displayOn(currentSprite);
});
function createElement(b, e) {
    if (stage.cursor != "default")
        return;
    stage.cursor = "crosshair";
    stage.addListener("mousedown", startDrag);
    function startDrag(s, e) {
        if (s.cursor != "crosshair")
            return;
        s.cursor = "se-resize";
        s.removeListener("mousedown", startDrag);
        s.addListener("mouseup", endDrag);
        s.addListener("mousemove", drag);
        fram.setRect(e.clientX, e.clientY, 0, 0);
        s.addChild(fram);
    }
    function drag(s, e) {
        if (s.cursor != "se-resize")
            return;
        fram.width = e.clientX - fram.x;
        fram.height = e.clientY - fram.y;
    }
    function endDrag(s, e) {
        if (s.cursor != "se-resize")
            return;
        if (fram.width == 0 && fram.height == 0)
            return;
        s.removeListener("mouseup", endDrag);
        s.removeListener("mousemove", drag);
        if (fram.rect.width > 0 && fram.rect.height > 0) {
            let el = new display_1.Sprite();
            el.name = "item_" + numCurrent++;
            el.setRectAs(fram.rect);
            el.setBackground(0xFFFFFF, 1.0);
            el.setBorder(1, 0x000000, 1.0, "solid");
            stage.addChild(el);
            setCurrentSprite(el);
            el.addListener("mousedown", setCurrentSprite);
        }
        stage.removeChild(fram);
        stage.cursor = "default";
    }
}
function setCurrentSprite(el) {
    currentSprite = el;
    if (currentSprite) {
        currentSprite.addChild(grid);
        grid.displayOn(currentSprite);
    }
}
function changeColor(h) {
    if (currentSprite) {
        currentSprite.setBackground(h.color, currentSprite.backgroundAlpha);
    }
}
function changeAlpha(alpha) {
    if (currentSprite) {
        currentSprite.setBackground(currentSprite.backgroundColor, alpha.pct);
    }
}
//# sourceMappingURL=renderer.js.map