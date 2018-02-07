import { Point, Rectangle, Matrix, Filter } from "./geom";
import { Fill, Stroke, Gradient, Graphics, Color } from "./graph";

/**
 * Renvoie un élément générique
 * @param idEl identifiant de l'élément recherché
 */
export const findEl = (idEl: string) => <HTMLElement>document.getElementById(idEl);
/**
 * Renvoie un élément de type Input
 * @param idEl identifiant de l'élément recherché 
 */
export const findIn = (idEl: string) => <HTMLInputElement>document.getElementById(idEl);
/**
 * Crée un élément du type choisi
 * @param type type de l'élément à créer
 */
const create = (type: string) => document.createElement(type);

/*******************************************************************************************
* L I S T E N E R
********************************************************************************************/
class Listener {
    public target:EventDispatcher;
    public type:string;
    public callback:Function;
    /**
     * Définit un écouteur d'événement pour un EventDispatcher
     * @param {EventDispatcher} target cible de l'événement
     * @param {string} type type d'événement à écouter
     * @param {Function} callback réaction à l'événement (target, event)
     */
    constructor(target:EventDispatcher, type:string, callback:Function) {
        this.target = target;
        this.type = type;
        this.callback = callback;
        let fx = (e: Event) => this.callback(this.target, e);
        this.target.el.addEventListener(this.type, fx); 
    }
    /**
     * Réaction à l'événement
     * @param e événement
     */
    handleEvent(e: Event) {
        this.callback(this.target, e);
    }
    /**
     * Supprime l'écoute et la détruit
     */
    remove(): void {
        let fx = (e: Event) => this.callback(this.target, e);
        this.target.el.removeEventListener(this.type, fx);
        const l:Listener[] = this.target.listeners, i = l.indexOf(this); 
        l.splice(i, 1);
    }
    /**
     * Teste la correspondance entre une écoute et celle-ci
     * @param {string} type type de l'événement à écouter
     * @param {Function} callback réaction attendue
     */
    public match(type:String, callback:Function):boolean {
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
    listeners: Listener[] = [];
    el: HTMLElement;
    /**
     * Crée un écouteur-diffuseur générique
     * @param element élement HTML embarqué
     */
    constructor(element:HTMLElement) {
        this.el = element;
    }
    /**
     * Nom (id) de l'élément 
     */
    get name(): string {
        return this.el.id;
    }
    set name(value: string) {
        this.setAttr("id", value);
    }
    /**
     * Valeur numérique d'un attribut
     * @param {string} propName propriété css dont on veut la valeur numérique
     */
    _getIntCss(propName: string): number {
        return parseInt( this.el.style.getPropertyValue(propName));
    }
    /**
     * Valeur numérique d'un attribut
     * @param {string} attrName Attribut dont on veut la valeur numérique
     */
    _getIntAttr(attrName: string): number {
        const attr = this.el.getAttribute(attrName);
        return attr ? parseInt(attr) : 0;
    }
    /**
     * Définit la valeur numérique d'un attribut
     * @param {string} attrName nom de l'attribut
     * @param value valeur (entière) de l'attribut
     */
    _setIntAttr(attrName: string, value:number):void {
        this.el.setAttribute(attrName, value.toString());
    }
    /**
     * Ajoute un écouteur d'événement
     * @param {string} type type de l'événement
     * @param {Function} callback réaction à l'événement
     */
    addListener(type: string, callback: Function): void {
        if (this.listeners.some((l: Listener) => l.match(type, callback))) return;
        this.listeners.push(new Listener(this, type, callback));
    }
    /**
     * Produit un événement
     * @param type type de l'événement à créer
     */
    dispatch(type: string): void {
        const e = new Event(type);
        this.listeners.filter(
            (item: Listener) => item.type == type).forEach(
            (item: Listener) => item.callback(this, e));
    }
    /**
     * Crée et active un écouteur d'événement
     * @param {string} type type de l'écoute
     * @param {Function} callback réaction à l'écoute
     */
    removeListener(type: string, callback: Function): void {
        var existe = this.listeners.find((l: Listener) => l.match(type, callback));
        if (existe) existe.remove();
    }
    /**
     * Supprime tous les écouteurs d'événements
     */
    removeAllListeners(): void {
        this.listeners.forEach((item: Listener) => item.remove());
    }
    /**
     * Modifie en une passe une liste d'attributs
     * @param {string[]} attrVals noms et valeurs d'attributs alternés 
     */
    setAttr(...attrVals: string[]): void {
        for (var i = 0; i < attrVals.length; i++){
            this.el.setAttribute(attrVals[i], attrVals[++i]);
        }
    }
    /**
     * Modifie en une passe une liste de propriétés css
     * @param {string[]} propsVals propriétés et valeurs alternées
     */
    setCss(...propsVals: string[]): void {
        for (var i = 0; i < propsVals.length; i++){
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
export class DisplayObject extends EventDispatcher {
    rect: Rectangle;
    css: CSSStyleDeclaration;
    back: Fill;
    border: Stroke;
    /*
    blendMode: String;
    filters: Filter[];
    rotation: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    scrollRect: Rectangle;
    */
    parent: DisplayObjectContainer | null;
    _stage: Stage | null
    constructor( element:HTMLElement) {
        super(element);
        this.css = this.el.style;
        this.rect = new Rectangle();
        this.rect.style = this.css;
        this.back = new Fill();
        this.border = new Stroke(); 
    }
    /**
     * Définit un arrière-plan en dégradé   
     * @param type type du dégradé ("linear"|"radial")
     * @param colors liste des couleurs dans l'ordre du dégradé
     * @param alphas liste des transparence dans l'ordre du dégradé
     * @param ratios positions des couleurs entre 0 et 255
     * @param angle orientation du dégradé en degrés 
     */
    gradientBackground(colors: number[],
        alphas: number[],
        ratios: number[],
        angle: number): DisplayObject {
        this.css.background = new Gradient("linear", colors, alphas, ratios, angle).css;
        return this;
    }
    /**
     * Définit la couleur et la transparence du fond
     * @param c couleur (0x000000 -> 0xFFFFFF)
     * @param a alpha (0.0 -> 1.0)
     */
    setBackground(c:number, a:number): DisplayObject {
        this.backgroundColor = c;
        this.backgroundAlpha = a;
        return this;
    }
    setBorder(t:number, c:number, a:number, styl:string, radius:number=0): DisplayObject {
        this.borderColor = c;
        this.borderAlpha = a;
        this.borderWidth = t;
        this.borderStyle = styl;
        if (radius) this.borderRadius = radius;
        return this;
    }
    /**
     * Définit la luminosité appliquée sur le DisplayObject
     * @param percent nombre entier (50 = 50% | 120 = 120%...)
     */
    setBrightness(percent: number) {
        this.setCss("filter", "brightness(" + percent + "%)");
    }
    /**
     * Définit la position et la taille du DisplayObject
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    setRect(px: number, py: number, w: number, h: number): DisplayObject {
        this.rect.setTo(px, py, w, h);
        return this;
    }
    /**
     * Reproduit la position et la taille d'un rectangle
     * @param r rectangle à copier
     */
    setRectAs(r: Rectangle): DisplayObject {
        this.rect.setTo(r.x, r.y, r.width, r.height);
        return this;
    }
    /**
     * Envoie le displayObject à l'arrière-plan sur son parent
     */
    toBack() {
        if (this.parent)  this.parent.addChildAt(0, this);    
    }
    /**
     * Met le displayObject au premier-plan sur son parent
     */
    toFront() {
        if (this.parent) this.parent.addChildAt(this.parent.numChildren - 1, this);
    }
    /**
     * Transparence générale (opacité)
     */
    get alpha(): number {
        return this._getIntCss("opacity");
    }
    set alpha(value: number) {
        this.setCss("opacity", value.toString());
    }
    /**
    * Transparence du fond
    */
    get backgroundAlpha():number {
        return this.back.alpha;
    }
    set backgroundAlpha(value:number) {
        this.back.alpha = value;
        this.css.backgroundColor = this.back.rgba;
    }
    /**
    * Couleur de fond
    */
    get backgroundColor():number {
        return this.back.color;
    }
    set backgroundColor(value:number) {
        this.back.color = value;
        this.css.backgroundColor = this.back.rgba;
    }    
    /**
    * Transparence du bord
    */
    get borderAlpha():number {
        return this.border.alpha;
    }
    set borderAlpha(value:number) {
        this.border.alpha = value;
        this.css.borderColor = this.border.rgba;
    }    
    /**
    * Couleur de bordure
    */
    get borderColor():number {
        return this.border.color;
    }
    set borderColor(value:number) {
        this.border.color = value;
        this.css.borderColor = this.border.rgba;
    }
    /**
    * Couleur de bordure
    */
    get borderRadius():number {
        return parseInt(this.css.borderRadius || "0");
    }
    set borderRadius(value:number) {
        this.css.borderRadius = value+"px";
    }
    /**
    * inset|outset|solid|dotted|dashed|double|groove|ridge|none
    */
    get borderStyle():string {
        return this.css.borderStyle || "none";
    }
    set borderStyle(value:string) {
        this.css.borderStyle = value;
    }
    /**
    * Épaisseur du bord
    */
    get borderWidth():number {
        return this.border.thickness;
    }
    set borderWidth(value:number) {
        this.border.thickness = value;
        this.css.borderWidth = this.border.thickness+"px";
    }
    /**
    * Curseur à utiliser
    */
    get cursor():string {
      return this.css.cursor || "default";
    }
    set cursor(value:string) {
      this.css.cursor = value;
    }
    /**
     * Position de la souris à l'intérieur de l'objet
     */
    get mouseX(): number {
        return parseInt(<string>this.el.getAttribute("mouseX"));
    }
    get mouseY(): number {
        return parseInt(<string>this.el.getAttribute("mouseY"));
    }
    get stage(): Stage | null {
        return this.parent ? this.parent.stage : null;
    }
    /**
     * Position de la souris à l'intérieur de l'objet
     */
    get stageX(): number {
        return this.stage ? this.stage.mouseX : 0;
    }
    get stageY(): number {
        return this.stage ? this.stage.mouseY : 0;
    }
    /**
     * Gauche du DisplayObject (dans son parent)
     */
    get x(): number {
        return this.rect.x;
    }
    set x(value: number) {
        if (this.rect.x != value) {
            this.rect.x = value;
            this.dispatch("pos");
        }
    }
    /**
     * Haut du DisplayObject (dans son parent)
     */
    get y(): number {
        return this.rect.y;
    }
    set y(value: number) {
        if (this.rect.y != value) {
            this.rect.y = value;
            this.dispatch("pos");
        }
    }
    /**
     * Largeur du DisplayBoject
     */
    get width(): number {
        return this.rect.width;
    }
    set width(value: number) {
        if (this.rect.width != value) {
            this.rect.width = value;
            this.dispatch("size");
        }
    }
    /**
     * Hauteur du DisplayObject
     */
    get height(): number {
        return this.rect.height;
    }
    set height(value: number) {
        if (this.rect.height != value) {
            this.rect.height = value;
            this.dispatch("size");
        }
    }
}

/*******************************************************************************************
*  I N T E R A C T I V E  O B J E C T
********************************************************************************************/
/**
 * Objet réactif
 * @author Jean-Marie PETIT
 */
class InteractiveObject extends DisplayObject {
    _tabEnabled: boolean;
    constructor(element:HTMLElement) {
        super(element);
        this.mouseEnabled = true;
    }
    /**
    * Définit l'ordre de tabulation
    */
    get tabIndex(): number {
        return this._getIntAttr("tabIndex");
    }
    set tabIndex(value:number) {
      this._setIntAttr("tabIndex", value);
    }
    /**
     * Réagit à la souris ?
     */
    get mouseEnabled(): boolean {
        return this.css.pointerEvents !== "none";
    }
    set mouseEnabled(value: boolean) {
        this.css.pointerEvents = value ? "auto" :"none";
    }
    /**
     * Est dans une liste de tabulation ?
     */
    get tabEnabled(): boolean {
        return this._tabEnabled;
    }
    set tabEnabled(value: boolean) {
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
export class DisplayObjectContainer extends InteractiveObject {
    children: DisplayObject[]
    constructor(element:HTMLElement) {
        super(element);
        this.children = [];
    }

    addChild(child: DisplayObject): DisplayObject {
        if (child.parent != null) {
            child.parent.removeChild(child);
        }
        this.children.push(child);
        this.el.appendChild(child.el);
        child.parent = this; 
        return child;
    }

    addChildAt(index: number, child: DisplayObject): DisplayObject {
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

    getChildAt(index:number): DisplayObject {
        return this.children[index];
    }

    getChildByName(childId: string): DisplayObject | null {
        let item = this.children.find((child: DisplayObject) => child.name == childId);
        return item !== undefined ? item : null;
    }
    getChildIndex(child: DisplayObject): number {
        return this.children.indexOf(child);
    }
    removeChild(child: DisplayObject): DisplayObject {
        if (child.parent == this) {
            this.children.splice(this.children.indexOf(child), 1);
            this.el.removeChild(child.el);
            child.parent = null;
        }
        return child;
    }
    removeChildAt(index: number): DisplayObject {
        if (index < 0 || index >= this.numChildren) {
            throw new RangeError("Aucun élément à l'index " + index.toString());
        }
        return this.removeChild(this.children[index]);
    }
    removeChildren(): void {
        while (this.numChildren > 0) {
            this.removeChildAt(this.numChildren - 1);
        }
    }
    get numChildren(): number {
        return this.children.length;
    }
}

/*******************************************************************************************
*  S T A G E
********************************************************************************************/

/**
 * Élément d'arrière-plan de page (= document.body)
 */
export class Stage extends DisplayObjectContainer {
    /**
     * Élement en cours (survolé par la souris)
     */
    hitElement: HTMLElement;
    graphics: Graphics;
    constructor(w:number, h:number, color:number) {
        super(document.body);
        this.css.position = "relative";
        this.name = "stage";
        this.graphics = new Graphics(this, this.el);
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

    get stage(): Stage {
        return this;
    }

    handleMouse(s:Stage, e: MouseEvent) {
        let hitEl: HTMLElement = e.target as HTMLElement;
        s.hitElement = hitEl;
        let hitR: ClientRect = hitEl.getBoundingClientRect();
        let [ecX, ecY, mx, my] = [e.clientX, e.clientY, e.clientX - hitR.left, e.clientY-hitR.top];

        // Mémorise dans l'élément les propriétés mouseX, mouseY
        hitEl.setAttribute("mouseX", mx.toString());
        hitEl.setAttribute("mouseY", my.toString());

        // Mémorise sur la scène en attributs la position de la souris  
        s._setIntAttr("mouseX", ecX);
        s._setIntAttr("mouseY", ecY);

        // ---------- TODO : enlever en production ------------
        //             Affichage dans le document
        // ----------------------------------------------------
        findIn("inId").value = hitEl.id;
        findIn("x").value = mx.toString();
        findIn("y").value = my.toString(); 
        findIn("sx").value = s.stageX.toString();
        findIn("sy").value = s.stageY.toString();
        const r =  hitEl.getBoundingClientRect()
        findIn("rect").value = `(x:${r.left},y:${r.top})-(W:${r.width}-H:${r.height})`;
    }
    /**
    * Position horizontale de la souris sur la scène
    */
    get stageX(): number {
        return this.mouseX;
    }
    /**
    * Position verticale de la souris sur la scène
    */
    get stageY(): number {
        return this.mouseY;
    }

    get stageWidth(): number {
        return parseInt(this.el.getAttribute("stageWidth") as string);
    }

    get stageHeight(): number {
        return parseInt(this.el.getAttribute("stageHeight") as string);
    }
}

/*******************************************************************************************
*  S H A P E
********************************************************************************************/

/**
 * Elément visuel avec interface graphique
 * @author Jean-Marie PETIT
 */
export class Shape extends DisplayObject {
    graphics: Graphics;
    constructor() {
        super(create("div"));
        this.graphics = new Graphics(this, this.el);
    }
}

/*******************************************************************************************
*  S P R I T E
********************************************************************************************/

/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
export class Sprite extends DisplayObjectContainer {
    graphics: Graphics;
    constructor() {
        super(create("div"));
        this.graphics = new Graphics(this, this.el);
    }
}

/*******************************************************************************************
*  T E X T  F O R M A T
********************************************************************************************/

export class TextFormat {
    private vals: (string | number | boolean)[] = [];
    private css: CSSStyleDeclaration;
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
    constructor(fontName: string="times new roman",
        fontSize: number = 12,
        textColor: number = 0x000000,
        isBold: boolean = false,
        isItal: boolean = false,
        isUnderline: boolean = false,
        textAlign: string = "left",
        mgLeft: number = 0,
        mgRight: number = 0,
        leadingSpace: number = 0,
        charSpacing:number = 0
    ) { 
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
    applyOn(css: CSSStyleDeclaration) {
        this.css = css;
        this.css.fontFamily = this.name;
        this.css.fontSize = this.size + "pt";
        this.css.color = Color.rgb(this.color);
        this.css.fontWeight = this.bold ? "bold" : "";
        this.css.fontStyle = this.italic ? "italic" : "";
        this.css.textDecoration = this.underline ? "underline" : "";
        this.css.textAlign = this.align;
        this.css.paddingLeft = this.marginLeft + "px";
        this.css.paddingRight = this.marginRight + "px";
        this.css.lineHeight = this.leading + "";
        this.css.letterSpacing = this.letterSpacing + "";
    }
    setValue(num: number, value: (number | boolean | string)) {
        this.vals[num] = value;
        if (this.css != null) {
            switch (num) {
                case 0: this.css.fontFamily = this.name; break;
                case 1: this.css.fontSize = this.size + "pt"; break;
                case 2: this.css.color = Color.rgb(this.color); break;
                case 3: this.css.fontWeight = this.bold ? "bold" : ""; break;
                case 4: this.css.fontStyle = this.italic ? "italic" : ""; break;
                case 5: this.css.textDecoration = this.underline ? "underline" : ""; break;
                case 6: this.css.textAlign = this.align; break;
                case 7: this.css.paddingLeft = this.marginLeft + "px"; break;
                case 8: this.css.paddingRight = this.marginRight + "px"; break;
                case 9: this.css.lineHeight = this.leading + ""; break;
                case 10: this.css.letterSpacing = this.letterSpacing + ""; break;    
            }
        } 
    }

    get name(): string {
        return <string>this.vals[0]; 
    }
    set name(value: string) {
        this.setValue(0, value);
    }
    get size(): number {
        return <number>this.vals[1]; 
    }
    set size(value: number) {
        this.setValue(1, value);
    }
    get color(): number {
        return <number>this.vals[2]; 
    }
    set color(value: number) {
        this.setValue(2, value);
    }
    get bold(): boolean {
        return <boolean>this.vals[3]; 
    }
    set bold(value: boolean) {
        this.setValue(3, value);
    }
    get italic(): boolean {
        return <boolean>this.vals[4]; 
    }
    set italic(value: boolean) {
        this.setValue(4, value);
    }
    get underline(): boolean {
        return <boolean>this.vals[5]; 
    }
    set underline(value: boolean) {
        this.setValue(5, value);
    }
    get align(): string {
        return <string>this.vals[6]; 
    }
    set align(value: string) {
        this.setValue(6, value);
    }
    get marginLeft(): number {
        return <number>this.vals[7]; 
    }
    set marginLeft(value: number) {
        this.setValue(7, value);
    }
    get marginRight(): number {
        return <number>this.vals[8]; 
    }
    set marginRight(value: number) {
        this.setValue(8, value);
    }
    get leading(): number {
        return <number>this.vals[9]; 
    }
    set leading(value: number) {
        this.setValue(9, value);
    }
    get letterSpacing(): number {
        return <number>this.vals[10]; 
    }
    set letterSpacing(value: number) {
        this.setValue(10, value);
    }
}

/*******************************************************************************************
*  T E X T  F I E L D
********************************************************************************************/

/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
export class TextField extends DisplayObject {
    graphics: Graphics;
    field: HTMLDivElement;
    private opt = [false, false, false];
    format: TextFormat;
    constructor() {
        super(create("div"));
        this.field = create("div") as HTMLDivElement;
        this.el.appendChild(this.field);
        this.defaultTextFormat = new TextFormat();
    }
    set defaultTextFormat(f: TextFormat) {
        this.format = f;
        f.applyOn(this.field.style);
    }
    get mouseEnabled(): boolean {
        return this.opt[0];
    }
    set mouseEnabled(value: boolean) {
        this.opt[0] = value;
        this.field.style.pointerEvents = value ? "visible" : "none";
    }
    get selectable(): boolean {
        return this.opt[1];
    }
    set selectable(value: boolean) {
        this.opt[1] = value;
        this.field.style.userSelect = value ? "all" : "none";
        this.field.style.msUserSelect = value ? "all" : "none";
        this.field.style.webkitUserSelect = value ? "all" : "none";
    }  
    get editable(): boolean {
        return this.opt[2];
    }
    set editable(value: boolean) {
        this.opt[2] = value;
        this.field.setAttribute("contenteditable", value.toString());
        this.field.style.cursor = value ? "auto" : "pointer";
    }
    get text(): string {
        return this.field.textContent || "";
    }
    set text(value: string) {
        this.field.textContent = value;
    }
}