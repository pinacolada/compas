"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geom_1 = require("./geom");
const graph_1 = require("./graph");
/**
 * Renvoie un élément générique
 * @param idEl identifiant de l'élément recherché
 */
const findEl = (idEl) => document.getElementById(idEl);
/**
 * Renvoie un élément de type Input
 * @param idEl identifiant de l'élément recherché
 */
const findIn = (idEl) => document.getElementById(idEl);
/**
 * Crée un élément du type choisi
 * @param type type de l'élément à créer
 */
const create = (type) => document.createElement(type);
/*******************************************************************************************
* L I S T E N E R
********************************************************************************************/
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
/*******************************************************************************************
* E V E N T  D I S P a T C H E R
********************************************************************************************/
/**
 * Diffuseur/écouteur d'événements générique
 * @author Jean-Marie PETIT
 */
class EventDispatcher {
    constructor(element) {
        this.listeners = [];
        this.el = element;
    }
    /**
     * Valeur numérique d'un attribut
     * @param attrName Attribut dont on veut la valeur numérique
     */
    _getIntAttr(attrName) {
        const attr = this.el.getAttribute(attrName);
        return attr ? parseInt(attr) : 0;
    }
    /**
     * Définit la valeur numérique d'un attribut
     * @param attrName nom de l'attribut
     * @param value valeur (entière) de l'attribut
     */
    _setIntAttr(attrName, value) {
        this.el.setAttribute(attrName, value.toString());
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
/*******************************************************************************************
*  D I S P L A Y  O B J E C T
********************************************************************************************/
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
    * inset|outset|solid|dotted|dashed|double|groove|ridge|none
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
     * Position de la souris à l'intérieur de l'objet
     */
    get stageX() {
        return this.stage ? this.stage.mouseX : 0;
    }
    get stageY() {
        return this.stage ? this.stage.mouseY : 0;
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
        if (this.rect.x != value) {
            this.rect.x = value;
            this.dispatchEvent(new Event("pos"));
        }
    }
    /**
     * Haut du DisplayObject (dans son parent)
     */
    get y() {
        return this.rect.y;
    }
    set y(value) {
        if (this.rect.y != value) {
            this.rect.y = value;
            this.dispatchEvent(new Event("pos"));
        }
    }
    /**
     * Largeur du DisplayBoject
     */
    get width() {
        return this.rect.width;
    }
    set width(value) {
        if (this.rect.width != value) {
            this.rect.width = value;
            this.dispatchEvent(new Event("size"));
        }
    }
    /**
     * Hauteur du DisplayObject
     */
    get height() {
        return this.rect.height;
    }
    set height(value) {
        if (this.rect.height != value) {
            this.rect.height = value;
            this.dispatchEvent(new Event("size"));
        }
    }
}
exports.DisplayObject = DisplayObject;
/*******************************************************************************************
*  I N T E R A C T I V E  O B J E C T
********************************************************************************************/
/**
 * Objet réactif
 * @author Jean-Marie PETIT
 */
class InteractiveObject extends DisplayObject {
    constructor(element) {
        super(element);
        this.mouseEnabled = true;
    }
    /**
    * Définit l'ordre de tabulation
    */
    get tabIndex() {
        return this._getIntAttr("tabIndex");
    }
    set tabIndex(value) {
        this._setIntAttr("tabIndex", value);
    }
    /**
     * Réagit à la souris ?
     */
    get mouseEnabled() {
        return this.css.pointerEvents !== "none";
    }
    set mouseEnabled(value) {
        this.css.pointerEvents = value ? "auto" : "none";
    }
    /**
     * Est dans une liste de tabulation ?
     */
    get tabEnabled() {
        return this._tabEnabled;
    }
    set tabEnabled(value) {
        this._tabEnabled = value;
    }
}
/*******************************************************************************************
*  D I S P L A Y  O B J E C T  C O N T A I N E R
********************************************************************************************/
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
/*******************************************************************************************
*  S T A G E
********************************************************************************************/
/**
 * Élément d'arrière-plan de page (= document.body)
 */
class Stage extends DisplayObjectContainer {
    constructor(w, h, color) {
        super(document.body);
        this.css.position = "relative";
        this.name = "stage";
        this.graphics = new graph_1.Graphics(this, this.el);
        this.addEventListener("mousemove", Stage.handleMouse);
        window.addEventListener("resize", (e) => Stage.handleSize(this, e));
        Stage.handleSize(this);
        this.backgroundColor = color;
        this.width = w;
        this.height = h;
    }
    get stage() {
        return this;
    }
    static handleSize(stage, e) {
        // Mémorise en attribut la taille de la scène (utilisée) 
        stage._setIntAttr("stageWidth", window.innerWidth);
        stage._setIntAttr("stageHeight", window.innerHeight);
        stage.css.width = window.innerWidth + "px";
        stage.css.height = window.innerHeight + "px";
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
        stage._setIntAttr("mouseX", ecX);
        stage._setIntAttr("mouseY", ecY);
        // ---------- TODO : enlever en production ------------
        //             Affichage dans le document
        // ----------------------------------------------------
        findIn("inId").value = hitEl.id;
        findIn("x").value = mx.toString();
        findIn("y").value = my.toString();
        findIn("sx").value = stage.stageX.toString();
        findIn("sy").value = stage.stageY.toString();
        const r = hitEl.getBoundingClientRect();
        findIn("rect").value = `(x:${r.left},y:${r.top})-(W:${r.width}-H:${r.height})`;
    }
    /**
    * Position horizontale de la souris sur la scène
    */
    get stageX() {
        return this.mouseX;
    }
    /**
    * Position verticale de la souris sur la scène
    */
    get stageY() {
        return this.mouseY;
    }
    get stageWidth() {
        return parseInt(this.el.getAttribute("stageWidth"));
    }
    get stageHeight() {
        return parseInt(this.el.getAttribute("stageHeight"));
    }
}
exports.Stage = Stage;
/*******************************************************************************************
*  S H A P E
********************************************************************************************/
/**
 * Elément visuel avec interface graphique
 * @author Jean-Marie PETIT
 */
class Shape extends DisplayObject {
    constructor() {
        super(create("div"));
        this.graphics = new graph_1.Graphics(this, this.el);
    }
}
exports.Shape = Shape;
/*******************************************************************************************
*  S P R I T E
********************************************************************************************/
/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
class Sprite extends DisplayObjectContainer {
    constructor() {
        super(create("div"));
        this.graphics = new graph_1.Graphics(this, this.el);
    }
}
exports.Sprite = Sprite;
/*******************************************************************************************
*  T E X T  F O R M A T
********************************************************************************************/
class TextFormat {
    constructor(name = "times new roman", size = 12, color = 0x000000, bold = false, italic = false, underline = false, align = "left", marginLeft = 0, marginRight = 0, leading = 0, letterSpacing = 0) {
        this.span = create("span");
        this.css = this.span.style;
        this.fontName = name;
        this.fontSize = size;
        this.textColor = color;
        this.textAlign = align;
        this.mgLeft = marginLeft;
        this.mgRight = marginRight;
    }
    /**
    * Police de caractère
    */
    get fontName() {
        return this.css.fontFamily;
    }
    set fontName(value) {
        this.css.fontFamily = value;
    }
    /**
    * Taille de la police
    */
    get fontSize() {
        return parseInt(this.css.fontSize);
    }
    set fontSize(value) {
        this.css.fontSize = value + "pt";
    }
    /**
    * Marge entre le texte et la bordure de droite
    */
    get mgLeft() {
        return parseInt(this.css.paddingLeft);
    }
    set mgLeft(value) {
        this.css.paddingLeft = value + "px";
    }
    /**
    * Marge entre le texte et la bordure de droite
    */
    get mgRight() {
        return parseInt(this.css.paddingRight);
    }
    set mgRight(value) {
        this.css.paddingRight = value + "px";
    }
    /**
    * Alignement du texte ( left | center | right | justify )
    */
    get textAlign() {
        return this.css.textAlign;
    }
    set textAlign(value) {
        this.css.textAlign = value;
    }
    /**
    * Couleur du texte
    */
    get textColor() {
        return graph_1.Color.hex(this.css.color ? this.css.color : "rgb(0,0,0)");
    }
    set textColor(value) {
        this.css.color = graph_1.Color.rgb(value);
    }
}
exports.TextFormat = TextFormat;
/*******************************************************************************************
*  T E X T  F I E L D
********************************************************************************************/
/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
class TextField extends DisplayObject {
    constructor() {
        super(create("div"));
        this.format = new TextFormat();
        this._span = this.format.span;
        this.el.appendChild(this._span);
        this._span.style.width = "100%";
        this._span.style.height = "100%";
    }
    get text() {
        return this._span.textContent || "";
    }
    set text(value) {
        this._span.textContent = value;
    }
}
exports.TextField = TextField;
//# sourceMappingURL=display.js.map