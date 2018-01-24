// Description du projet
// 
// 
// --------------------------------------------
import {DisplayObjectContainer, DisplayObject, Stage, Sprite, Shape } from "./display";
let stage: Stage = new Stage(1024, 600, 0x9999FF);

var carre: Sprite = new Sprite();
carre.name = "carré";
stage.addChild(carre);
carre.setRect(100, 100, 200, 80);
carre.backgroundColor = 0x00CC00;
carre.backgroundAlpha = 0.5;
carre.borderColor = 0xFF0000;
carre.borderStyle = "dotted";
carre.borderWidth = 3;

var btn: Sprite = new Sprite();
btn.name = "btn";
stage.addChild(btn);
btn.setRect(50, 220, 100, 50);
btn.borderColor = 0x099CC;
btn.borderRadius = 12;
btn.gradientBackground([0xFFFFFF,0x099CC, 0x000000],[0.4,1.0,0.4], [0,64,255], 180);


console.log("Dessin terminé.");
