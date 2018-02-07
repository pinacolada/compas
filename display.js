"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geom_1 = require("./geom");
const graph_1 = require("./graph");
/**
 * Renvoie un élément générique
 * @param idEl identifiant de l'élément recherché
 */
exports.findEl = (idEl) => document.getElementById(idEl);
/**
 * Renvoie un élément de type Input
 * @param idEl identifiant de l'élément recherché
 */
exports.findIn = (idEl) => document.getElementById(idEl);
/**
 * Crée un élément du type choisi
 * @param type type de l'élément à créer
 */
const create = (type) => document.createElement(type);
/*******************************************************************************************
* L I S T E N E R
********************************************************************************************/
class Listener {
    /**
     * Définit un écouteur d'événement pour un EventDispatcher
     * @param {EventDispatcher} target cible de l'événement
     * @param {string} type type d'événement à écouter
     * @param {Function} callback réaction à l'événement (target, event)
     */
    constructor(target, type, callback) {
        this.target = target;
        this.type = type;
        this.callback = callback;
        let fx = (e) => this.callback(this.target, e);
        this.target.el.addEventListener(this.type, fx);
    }
    /**
     * Réaction à l'événement
     * @param e événement
     */
    handleEvent(e) {
        this.callback(this.target, e);
    }
    /**
     * Supprime l'écoute et la détruit
     */
    remove() {
        let fx = (e) => this.callback(this.target, e);
        this.target.el.removeEventListener(this.type, fx);
        const l = this.target.listeners, i = l.indexOf(this);
        l.splice(i, 1);
    }
    /**
     * Teste la correspondance entre une écoute et celle-ci
     * @param {string} type type de l'événement à écouter
     * @param {Function} callback réaction attendue
     */
    match(type, callback) {
        return this.type === type && this.callback === callback;
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
    /**
     * Crée un écouteur-diffuseur générique
     * @param element élement HTML embarqué
     */
    constructor(element) {
        this.listeners = [];
        this.el = element;
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
    /**
     * Valeur numérique d'un attribut
     * @param {string} propName propriété css dont on veut la valeur numérique
     */
    _getIntCss(propName) {
        return parseInt(this.el.style.getPropertyValue(propName));
    }
    /**
     * Valeur numérique d'un attribut
     * @param {string} attrName Attribut dont on veut la valeur numérique
     */
    _getIntAttr(attrName) {
        const attr = this.el.getAttribute(attrName);
        return attr ? parseInt(attr) : 0;
    }
    /**
     * Définit la valeur numérique d'un attribut
     * @param {string} attrName nom de l'attribut
     * @param value valeur (entière) de l'attribut
     */
    _setIntAttr(attrName, value) {
        this.el.setAttribute(attrName, value.toString());
    }
    /**
     * Ajoute un écouteur d'événement
     * @param {string} type type de l'événement
     * @param {Function} callback réaction à l'événement
     */
    addListener(type, callback) {
        if (this.listeners.some((l) => l.match(type, callback)))
            return;
        this.listeners.push(new Listener(this, type, callback));
    }
    /**
     * Produit un événement
     * @param type type de l'événement à créer
     */
    dispatch(type) {
        const e = new Event(type);
        this.listeners.filter((item) => item.type == type).forEach((item) => item.callback(this, e));
    }
    /**
     * Crée et active un écouteur d'événement
     * @param {string} type type de l'écoute
     * @param {Function} callback réaction à l'écoute
     */
    removeListener(type, callback) {
        var existe = this.listeners.find((l) => l.match(type, callback));
        if (existe)
            existe.remove();
    }
    /**
     * Supprime tous les écouteurs d'événements
     */
    removeAllListeners() {
        this.listeners.forEach((item) => item.remove());
    }
    /**
     * Modifie en une passe une liste d'attributs
     * @param {string[]} attrVals noms et valeurs d'attributs alternés
     */
    setAttr(...attrVals) {
        for (var i = 0; i < attrVals.length; i++) {
            this.el.setAttribute(attrVals[i], attrVals[++i]);
        }
    }
    /**
     * Modifie en une passe une liste de propriétés css
     * @param {string[]} propsVals propriétés et valeurs alternées
     */
    setCss(...propsVals) {
        for (var i = 0; i < propsVals.length; i++) {
            this.el.style.setProperty(propsVals[i], propsVals[++i]);
        }
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
     * Définit la couleur et la transparence du fond
     * @param c couleur (0x000000 -> 0xFFFFFF)
     * @param a alpha (0.0 -> 1.0)
     */
    setBackground(c, a) {
        this.backgroundColor = c;
        this.backgroundAlpha = a;
        return this;
    }
    setBorder(t, c, a, styl, radius = 0) {
        this.borderColor = c;
        this.borderAlpha = a;
        this.borderWidth = t;
        this.borderStyle = styl;
        if (radius)
            this.borderRadius = radius;
        return this;
    }
    /**
     * Définit la luminosité appliquée sur le DisplayObject
     * @param percent nombre entier (50 = 50% | 120 = 120%...)
     */
    setBrightness(percent) {
        this.setCss("filter", "brightness(" + percent + "%)");
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
     * Reproduit la position et la taille d'un rectangle
     * @param r rectangle à copier
     */
    setRectAs(r) {
        this.rect.setTo(r.x, r.y, r.width, r.height);
        return this;
    }
    /**
     * Envoie le displayObject à l'arrière-plan sur son parent
     */
    toBack() {
        if (this.parent)
            this.parent.addChildAt(0, this);
    }
    /**
     * Met le displayObject au premier-plan sur son parent
     */
    toFront() {
        if (this.parent)
            this.parent.addChildAt(this.parent.numChildren - 1, this);
    }
    /**
     * Transparence générale (opacité)
     */
    get alpha() {
        return this._getIntCss("opacity");
    }
    set alpha(value) {
        this.setCss("opacity", value.toString());
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
        return parseInt(this.css.borderRadius || "0");
    }
    set borderRadius(value) {
        this.css.borderRadius = value + "px";
    }
    /**
    * inset|outset|solid|dotted|dashed|double|groove|ridge|none
    */
    get borderStyle() {
        return this.css.borderStyle || "none";
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
    * Curseur à utiliser
    */
    get cursor() {
        return this.css.cursor || "default";
    }
    set cursor(value) {
        this.css.cursor = value;
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
    get stage() {
        return this.parent ? this.parent.stage : null;
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
     * Gauche du DisplayObject (dans son parent)
     */
    get x() {
        return this.rect.x;
    }
    set x(value) {
        if (this.rect.x != value) {
            this.rect.x = value;
            this.dispatch("pos");
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
            this.dispatch("pos");
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
            this.dispatch("size");
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
            this.dispatch("size");
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
        window.addEventListener("resize", e => {
            // Mémorise en attribut la taille de la scène (utilisée)
            this._setIntAttr("stageWidth", window.innerWidth);
            this._setIntAttr("stageHeight", window.innerHeight);
            this.css.width = window.innerWidth + "px";
            this.css.height = window.innerHeight + "px";
        });
        this.addListener("mousemove", this.handleMouse);
        this.backgroundColor = color;
        this.parent = this;
        this._stage = this;
        this.width = w;
        this.height = h;
    }
    get stage() {
        return this;
    }
    handleMouse(s, e) {
        let hitEl = e.target;
        s.hitElement = hitEl;
        let hitR = hitEl.getBoundingClientRect();
        let [ecX, ecY, mx, my] = [e.clientX, e.clientY, e.clientX - hitR.left, e.clientY - hitR.top];
        // Mémorise dans l'élément les propriétés mouseX, mouseY
        hitEl.setAttribute("mouseX", mx.toString());
        hitEl.setAttribute("mouseY", my.toString());
        // Mémorise sur la scène en attributs la position de la souris  
        s._setIntAttr("mouseX", ecX);
        s._setIntAttr("mouseY", ecY);
        // ---------- TODO : enlever en production ------------
        //             Affichage dans le document
        // ----------------------------------------------------
        exports.findIn("inId").value = hitEl.id;
        exports.findIn("x").value = mx.toString();
        exports.findIn("y").value = my.toString();
        exports.findIn("sx").value = s.stageX.toString();
        exports.findIn("sy").value = s.stageY.toString();
        const r = hitEl.getBoundingClientRect();
        exports.findIn("rect").value = `(x:${r.left},y:${r.top})-(W:${r.width}-H:${r.height})`;
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
    /**
     * Formatage d'un TextField : texte entier / partie de texte
     * @param fontName Nom de la police
     * @param fontSize couleur du texte
     * @param textColor taille de la police
     * @param isBold en gras ?
     * @param isItal en italiques ?
     * @param isUnderline souligner ?
     * @param textAlign aligner [gauche:left|centre:center|droite:right|justifié:justify]
     * @param mgLeft indentation à gauche
     * @param mgRight indentation à droite
     * @param leadingSpace espace entre les lignes
     * @param charSpacing espace entre les caractères
     */
    constructor(fontName = "times new roman", fontSize = 12, textColor = 0x000000, isBold = false, isItal = false, isUnderline = false, textAlign = "left", mgLeft = 0, mgRight = 0, leadingSpace = 0, charSpacing = 0) {
        this.vals = [];
        this.name = fontName;
        this.size = fontSize;
        this.color = textColor;
        this.bold = isBold;
        this.italic = isItal;
        this.underline = isUnderline;
        this.align = textAlign;
        this.marginLeft = mgLeft;
        this.marginRight = mgRight;
        this.leading = leadingSpace;
        this.letterSpacing = charSpacing;
    }
    applyOn(css) {
        this.css = css;
        this.css.fontFamily = this.name;
        this.css.fontSize = this.size + "pt";
        this.css.color = graph_1.Color.rgb(this.color);
        this.css.fontWeight = this.bold ? "bold" : "";
        this.css.fontStyle = this.italic ? "italic" : "";
        this.css.textDecoration = this.underline ? "underline" : "";
        this.css.textAlign = this.align;
        this.css.paddingLeft = this.marginLeft + "px";
        this.css.paddingRight = this.marginRight + "px";
        this.css.lineHeight = this.leading + "";
        this.css.letterSpacing = this.letterSpacing + "";
    }
    setValue(num, value) {
        this.vals[num] = value;
        if (this.css != null) {
            switch (num) {
                case 0:
                    this.css.fontFamily = this.name;
                    break;
                case 1:
                    this.css.fontSize = this.size + "pt";
                    break;
                case 2:
                    this.css.color = graph_1.Color.rgb(this.color);
                    break;
                case 3:
                    this.css.fontWeight = this.bold ? "bold" : "";
                    break;
                case 4:
                    this.css.fontStyle = this.italic ? "italic" : "";
                    break;
                case 5:
                    this.css.textDecoration = this.underline ? "underline" : "";
                    break;
                case 6:
                    this.css.textAlign = this.align;
                    break;
                case 7:
                    this.css.paddingLeft = this.marginLeft + "px";
                    break;
                case 8:
                    this.css.paddingRight = this.marginRight + "px";
                    break;
                case 9:
                    this.css.lineHeight = this.leading + "";
                    break;
                case 10:
                    this.css.letterSpacing = this.letterSpacing + "";
                    break;
            }
        }
    }
    get name() {
        return this.vals[0];
    }
    set name(value) {
        this.setValue(0, value);
    }
    get size() {
        return this.vals[1];
    }
    set size(value) {
        this.setValue(1, value);
    }
    get color() {
        return this.vals[2];
    }
    set color(value) {
        this.setValue(2, value);
    }
    get bold() {
        return this.vals[3];
    }
    set bold(value) {
        this.setValue(3, value);
    }
    get italic() {
        return this.vals[4];
    }
    set italic(value) {
        this.setValue(4, value);
    }
    get underline() {
        return this.vals[5];
    }
    set underline(value) {
        this.setValue(5, value);
    }
    get align() {
        return this.vals[6];
    }
    set align(value) {
        this.setValue(6, value);
    }
    get marginLeft() {
        return this.vals[7];
    }
    set marginLeft(value) {
        this.setValue(7, value);
    }
    get marginRight() {
        return this.vals[8];
    }
    set marginRight(value) {
        this.setValue(8, value);
    }
    get leading() {
        return this.vals[9];
    }
    set leading(value) {
        this.setValue(9, value);
    }
    get letterSpacing() {
        return this.vals[10];
    }
    set letterSpacing(value) {
        this.setValue(10, value);
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
        this.opt = [false, false, false];
        this.field = create("div");
        this.el.appendChild(this.field);
        this.defaultTextFormat = new TextFormat();
    }
    set defaultTextFormat(f) {
        this.format = f;
        f.applyOn(this.field.style);
    }
    get mouseEnabled() {
        return this.opt[0];
    }
    set mouseEnabled(value) {
        this.opt[0] = value;
        this.field.style.pointerEvents = value ? "visible" : "none";
    }
    get selectable() {
        return this.opt[1];
    }
    set selectable(value) {
        this.opt[1] = value;
        this.field.style.userSelect = value ? "all" : "none";
        this.field.style.msUserSelect = value ? "all" : "none";
        this.field.style.webkitUserSelect = value ? "all" : "none";
    }
    get editable() {
        return this.opt[2];
    }
    set editable(value) {
        this.opt[2] = value;
        this.field.setAttribute("contenteditable", value.toString());
        this.field.style.cursor = value ? "auto" : "pointer";
    }
    get text() {
        return this.field.textContent || "";
    }
    set text(value) {
        this.field.textContent = value;
    }
}
exports.TextField = TextField;
//# sourceMappingURL=display.js.map