// Description du projet
// 
// 
// --------------------------------------------
import {DisplayObjectContainer, DisplayObject, Stage, Sprite, Shape, TextField, TextFormat } from "./display";

let stage: Stage = new Stage(1024, 600, 0x9999FF);
var carre: Sprite = new Sprite();
carre.name = "carré";
stage.addChild(carre);
carre.setRect(150, 50, 250, 250);
carre.backgroundColor = 0x00CC00;
carre.backgroundAlpha = 0.5;
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


var btn: TextField = new TextField();
btn.name = "bouton";
stage.addChild(btn);
btn.setRect(50, 350, 140, 40);
btn.y = 350;
btn.gradientBackground([0xFFFFFF, 0x099CC, 0x333333], [1, 1, 1], [0, 64, 255], 180);
btn.borderRadius = 12;
btn.format.textAlign = "center";
btn.format.textColor = 0xFF0000;

btn.text = "TextField";

stage.graphics.lineStyle(1, 0x666699, 0.5);
for (let i = 0; i < stage.width; i += 50) {
    stage.graphics.moveTo(i, 0);
    stage.graphics.lineTo(i, stage.height);
}

for (let j = 0; j < stage.height; j += 50) {
    stage.graphics.moveTo(0, j);
    stage.graphics.lineTo(stage.width, j);
}

console.log("Dessin terminé.");
