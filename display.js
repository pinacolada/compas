"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geom_1 = require("./geom");
const graph_1 = require("./graph");
const find = (idEl, T) => document.getElementById(idEl);
const create = (type) => document.createElement(type);
class Listener {
    constructor(target, type, callback) {
        this.target = target;
        this.type = type;
        this.callback = callback;
        this.start();
    }
    handleEvent(e) {
        this.callback(e);
    }
    start() {
        this.target.el.addEventListener(this.type, (e) => this.callback(this.target, e));
    }
    stop() {
        this.target.el.removeEventListener(this.type, (e) => this.callback(this.target, e));
    }
    match(type, callback) {
        return this.type === type && this.callback === callback;
    }
    remove() {
        this.stop();
        let index = this.target.listeners.indexOf(this);
        this.target.listeners.splice(index, 1);
    }
}
/**
 * Diffuseur/écouteur d'événements générique
 * @author Jean-Marie PETIT
 */
class EventDispatcher {
    constructor(element) {
        this.listeners = [];
        this.el = element;
    }
    addEventListener(type, callback) {
        if (this.listeners.some((l) => l.match(type, callback)))
            return;
        this.listeners.push(new Listener(this, type, callback));
    }
    dispatchEvent(a) {
        this.listeners.filter((item) => item.type == a.type).forEach((item) => item.callback(a));
    }
    removeEventListener(type, callback) {
        var existe = this.listeners.find((l) => l.match(type, callback));
        if (existe != undefined)
            existe.remove();
    }
    removeAllListeners() {
        this.listeners.forEach((item) => item.remove());
    }
    setAttr(attrName, attrVal) {
        this.el.setAttribute(attrName, attrVal);
    }
}
/**
 * Objet affichable
 * @author Jean-Marie PETIT
 */
class DisplayObject extends EventDispatcher {
    constructor(element) {
        super(element);
        this.css = this.el.style;
        this.rect = new geom_1.Rectangle();
        this.rect.style = this.css;
        this.back = new graph_1.Fill();
        this.border = new graph_1.Stroke();
        this.borderStyle = "solid";
        this.borderWidth = 1;
    }
    /**
     * Définit un arrière-plan en dégradé
     * @param type type du dégradé ("linear"|"radial")
     * @param colors liste des couleurs dans l'ordre du dégradé
     * @param alphas liste des transparence dans l'ordre du dégradé
     * @param ratios positions des couleurs entre 0 et 255
     * @param angle orientation du dégradé en degrés
     */
    gradientBackground(colors, alphas, ratios, angle) {
        this.css.background = new graph_1.Gradient("linear", colors, alphas, ratios, angle).css;
        return this;
    }
    /**
     * Définit la position et la taille du DisplayObject
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    setRect(px, py, w, h) {
        this.rect.setTo(px, py, w, h);
        return this;
    }
    /**
     * Transparence générale (opacité)
     */
    get alpha() {
        let o = this.css.opacity;
        return o != null ? parseFloat(o) : 1.0;
    }
    set alpha(value) {
        this.css.opacity = value.toString();
    }
    /**
    * Transparence du fond
    */
    get backgroundAlpha() {
        return this.back.alpha;
    }
    set backgroundAlpha(value) {
        this.back.alpha = value;
        this.css.backgroundColor = this.back.rgba;
    }
    /**
    * Couleur de fond
    */
    get backgroundColor() {
        return this.back.color;
    }
    set backgroundColor(value) {
        this.back.color = value;
        this.css.backgroundColor = this.back.rgba;
    }
    /**
    * Transparence du bord
    */
    get borderAlpha() {
        return this.border.alpha;
    }
    set borderAlpha(value) {
        this.border.alpha = value;
        this.css.borderColor = this.border.rgba;
    }
    /**
    * Couleur de bordure
    */
    get borderColor() {
        return this.border.color;
    }
    set borderColor(value) {
        this.border.color = value;
        this.css.borderColor = this.border.rgba;
    }
    /**
    * Couleur de bordure
    */
    get borderRadius() {
        return parseInt(this.css.borderRadius);
    }
    set borderRadius(value) {
        this.css.borderRadius = value + "px";
    }
    /**
    * Style de la bordure
    */
    get borderStyle() {
        return this.css.borderStyle;
    }
    set borderStyle(value) {
        this.css.borderStyle = value;
    }
    /**
    * Épaisseur du bord
    */
    get borderWidth() {
        return this.border.thickness;
    }
    set borderWidth(value) {
        this.border.thickness = value;
        this.css.borderWidth = this.border.thickness + "px";
    }
    /**
     * Position de la souris à l'intérieur de l'objet
     */
    get mouseX() {
        return parseInt(this.el.getAttribute("mouseX"));
    }
    get mouseY() {
        return parseInt(this.el.getAttribute("mouseY"));
    }
    /**
     * Nom (id) de l'élément
     */
    get name() {
        return this.el.id;
    }
    set name(value) {
        this.setAttr("id", value);
    }
    get stage() {
        if (this.parent == null)
            return null;
        return this.parent.stage;
    }
    /**
     * Gauche du DisplayObject (dans son parent)
     */
    get x() {
        return this.rect.x;
    }
    set x(value) {
        this.rect.x = value;
    }
    /**
     * Haut du DisplayObject (dans son parent)
     */
    get y() {
        return this.rect.y;
    }
    set y(value) {
        this.rect.y = value;
    }
    /**
     * Largeur du DisplayBoject
     */
    get width() {
        return this.rect.width;
    }
    set width(value) {
        this.rect.width = value;
    }
    /**
     * Hauteur du DisplayObject
     */
    get height() {
        return this.rect.height;
    }
    set height(value) {
        this.rect.height = value;
    }
}
exports.DisplayObject = DisplayObject;
/**
 * Objet réactif
 * @author Jean-Marie PETIT
 */
class InteractiveObject extends DisplayObject {
    constructor(element) {
        super(element);
    }
    get mouseEnabled() {
        return this._mouseEnabled;
    }
    set mouseEnabled(value) {
        this._mouseEnabled = value;
    }
    get tabEnabled() {
        return this._tabEnabled;
    }
    set tabEnabled(value) {
        this._tabEnabled = value;
    }
}
/**
 * Objet visuel pouvant contenir d'autres objets
 * @author Jean-Marie PETIT
 */
class DisplayObjectContainer extends InteractiveObject {
    constructor(element) {
        super(element);
        this.children = [];
    }
    addChild(child) {
        if (child.parent != null) {
            child.parent.removeChild(child);
        }
        this.children.push(child);
        this.el.appendChild(child.el);
        child.parent = this;
        return child;
    }
    addChildAt(index, child) {
        if (child.parent != null) {
            child.parent.removeChild(child);
        }
        index = (index >= this.numChildren) ?
            this.numChildren :
            index < 0 ? 0 :
                index;
        this.children.splice(index, 0, child);
        this.el.insertBefore(child.el, this.el.childNodes[index]);
        child.parent = this;
        return child;
    }
    getChildAt(index) {
        return this.children[index];
    }
    getChildByName(childId) {
        let item = this.children.find((child) => child.name == childId);
        return item !== undefined ? item : null;
    }
    getChildIndex(child) {
        return this.children.indexOf(child);
    }
    removeChild(child) {
        if (child.parent == this) {
            this.children.splice(this.children.indexOf(child), 1);
            this.el.removeChild(child.el);
            child.parent = null;
        }
        return child;
    }
    removeChildAt(index) {
        if (index < 0 || index >= this.numChildren) {
            throw new RangeError("Aucun élément à l'index " + index.toString());
        }
        return this.removeChild(this.children[index]);
    }
    removeChildren() {
        while (this.numChildren > 0) {
            this.removeChildAt(this.numChildren - 1);
        }
    }
    get numChildren() {
        return this.children.length;
    }
}
exports.DisplayObjectContainer = DisplayObjectContainer;
/**
 * Elément visuel avec interface graphique
 * @author Jean-Marie PETIT
 */
class Shape extends DisplayObject {
    constructor() {
        super(create("div"));
        this.graphics = new graph_1.Graphics(this.el);
    }
}
exports.Shape = Shape;
/**
 * Élément d'arrière-plan de page (= document.body)
 */
class Stage extends DisplayObjectContainer {
    constructor(w, h, color) {
        super(document.body);
        this.name = "stage";
        this.addEventListener("mousemove", Stage.handleMouse);
        window.addEventListener("resize", (e) => Stage.handleSize(this, e));
        Stage.handleSize(this);
        this.backgroundColor = color;
    }
    get stage() {
        return this;
    }
    static handleSize(stage, e) {
        // Mémorise en attribut la taille de la scène (utilisée) 
        stage.setAttr("stageWidth", window.innerWidth.toString());
        stage.setAttr("stageHeight", window.innerHeight.toString());
    }
    static handleMouse(stage, e) {
        let hitEl = e.target;
        stage.hitElement = hitEl;
        let hitR = hitEl.getBoundingClientRect();
        let [ecX, ecY, mx, my] = [e.clientX, e.clientY, e.clientX - hitR.left, e.clientY - hitR.top];
        // Mémorise dans l'élément les propriétés mouseX, mouseY
        hitEl.setAttribute("mouseX", mx.toString());
        hitEl.setAttribute("mouseY", my.toString());
        // Mémorise sur la scène en attributs la position de la souris  
        stage.setAttr("stageX", ecX.toString());
        stage.setAttr("stageY", ecY.toString());
        // ---------- TODO : enlever en production ------------
        //             Affichage dans le document
        // ----------------------------------------------------
        find("inId", HTMLInputElement).value = hitEl.id;
        find("inPx", HTMLInputElement).value = mx.toString();
        find("inPy", HTMLInputElement).value = my.toString();
    }
    /**
    * Position horizontale de la souris sur la scène
    */
    get stageX() {
        return parseInt(this.el.getAttribute("stageX"));
    }
    /**
    * Position verticale de la souris sur la scène
    */
    get stageY() {
        return parseInt(this.el.getAttribute("stageY"));
    }
    get stageWidth() {
        return parseInt(this.el.getAttribute("stageWidth"));
    }
    get stageHeight() {
        return parseInt(this.el.getAttribute("stageHeight"));
    }
}
exports.Stage = Stage;
/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
class Sprite extends DisplayObjectContainer {
    constructor() {
        super(create("div"));
        this.graphics = new graph_1.Graphics(this.el);
    }
}
exports.Sprite = Sprite;
class TextFormat {
    constructor(name = "times new roman", size = 12, color = 0x000000, bold = false, italic = false, underline = false, align = "left", marginLeft = 0, marginRight = 0, leading = 0, letterSpacing = 0) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.align = align;
        this.marginLeft = marginLeft;
        this.marginRight = marginRight;
        this.leading = leading;
        this.letterSpacing = letterSpacing;
    }
    applyOn(style) {
        this.css = style;
    }
}
exports.TextFormat = TextFormat;
/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
class TextField extends DisplayObject {
    constructor() {
        super(create("div"));
        this.format = new TextFormat();
        this.format.applyOn(this.el.style);
    }
}
exports.TextField = TextField;
//# sourceMappingURL=display.js.map