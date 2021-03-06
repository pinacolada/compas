import {DisplayObjectContainer, DisplayObject, Stage, Sprite, Shape, TextField, TextFormat, findIn } from "./display";
import { Button, ResizerGrid, HSLColorPicker, RGBColorPicker, Slider, ColorPicker, HSVColorPicker } from "./ui";
import { Rectangle } from  "./geom";

let stage: Stage = new Stage(1024, 600, 0x9999FF);

var carre: Sprite = new Sprite();
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
gr.lineStyle();// pas de bordure
gr.beginFill(0xFF0000, 1);
gr.drawCircle(20, 20, 15);
gr.beginFill(0xFF00FF, 1);
gr.drawPolygon(
    100, 50,
    100, 100,
    50, 100,
    50, 150,
    100, 150,
    100, 200,
    150, 200,
    150, 150,
    200, 150,
    200, 100,
    150, 100,
    150, 50);
gr.lineStyle(3, 0x000099, 1);// retour de la bordure
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

let currentSprite: Sprite | null;
let newS: Sprite | null;

let hsl: HSLColorPicker = new HSLColorPicker("hsl", stage, 25, 310, 0xFF00FF, changeColor);
let rp: RGBColorPicker = new RGBColorPicker("rgb", stage, 125, 310, 0x336699, changeColor);
// let hsv: HSVColorPicker = new HSVColorPicker("hsv", stage, 80, 310, 0x66FF66, changeColor);

const bCreEl:Button = new Button("cre", stage, 735, 70, 150, 40, 0x666666, "Créer un élément");
bCreEl.addListener("click", createElement);

let alpha = new Slider("alpha", stage, 25, 550, 200, 1, 0, 1, true);
alpha.gradientBackground([0x000000, 0x000000], [0, 1], [0, 255], 90);
alpha.addListener("change", () => changeAlpha(alpha));

const fram: Sprite = new Sprite();
fram.setBorder(1, 0xFF0000, 0.6, "dotted");

const grid: ResizerGrid = new ResizerGrid();
let numCurrent = 1;

stage.addListener("keydown", (s:Stage, e: KeyboardEvent) => {
    if (currentSprite == null) return;
    if (e.key === "Delete") {
        currentSprite.removeChild(grid);
        s.removeChild(currentSprite);
        currentSprite = null;
    } else if (e.key === "ArrowUp") {
        e.shiftKey ? currentSprite.height-- : currentSprite.y--;
    } else if (e.key === "ArrowDown") {
        e.shiftKey ? currentSprite.height++ : currentSprite.y++;
    } else if (e.key === "ArrowLeft") {
        e.shiftKey ? currentSprite.width-- : currentSprite.x--;
    } else if (e.key === "ArrowRight") {
        e.shiftKey ? currentSprite.width++ : currentSprite.x++;
    } else if (e.key === "c" && e.ctrlKey) {
        newS = <Sprite>currentSprite.clone(Sprite);
    } else if (e.key === "v" && e.ctrlKey && newS != null && newS !== currentSprite) {
        stage.addChild(newS);
        newS.x += 20;
        newS.y -= 20;
        setCurrentSprite(newS);
    } else {
        console.log("ctrlKey :", e.ctrlKey, "- shiftKey :", e.shiftKey, "- keyCode:", e.keyCode, "-key :", e.key);
    }
    if(currentSprite) grid.displayOn(currentSprite);
});

function createElement(b:Button, e: MouseEvent) {
    if (stage.cursor != "default") return;
    stage.cursor = "crosshair";
    stage.addListener("mousedown", startDrag);

    function startDrag(s:Stage, e:MouseEvent) {
        if (s.cursor != "crosshair") return;
        s.cursor = "se-resize";
        s.removeListener("mousedown", startDrag);
        s.addListener("mouseup", endDrag);
        s.addListener("mousemove", drag);
        fram.setRect(e.clientX, e.clientY, 0, 0);
        s.addChild(fram);
    }
    function drag(s:Stage, e: MouseEvent) {
        if (s.cursor != "se-resize") return;   
        fram.width = e.clientX - fram.x;
        fram.height = e.clientY - fram.y;
    } 
    function endDrag(s:Stage, e: MouseEvent) {
        if (s.cursor != "se-resize") return; 
        if (fram.width == 0 && fram.height == 0) return; 
        s.removeListener("mouseup", endDrag);
        s.removeListener("mousemove", drag);
        if (fram.rect.width > 0 && fram.rect.height > 0) {
            createSprite(fram.rect)
        }
        stage.removeChild(fram);
        stage.cursor = "default";
    }
}

function createSprite(r:Rectangle) {
    let el = new Sprite();
    el.name = "item_" + numCurrent++;
    el.setRectAs(r);
    el.setBackground(0xFFFFFF, 0.5);
    el.setBorder(1, 0x000000, 1.0, "solid");
    stage.addChild(el);    
    setCurrentSprite(el); 
}

function setCurrentSprite(el: Sprite) {
    currentSprite = el;
    if (currentSprite) {
        currentSprite.addChild(grid);
        grid.displayOn(currentSprite);
    }
    el.addListener("mousedown", setCurrentSprite);
}
function changeColor(h:ColorPicker) {
    if (currentSprite) {
        currentSprite.setBackground(h.color, currentSprite.backgroundAlpha);
    }
}
function changeAlpha(alpha:Slider) {
    if (currentSprite) {
        currentSprite.setBackground(currentSprite.backgroundColor, alpha.pct);
    }
}