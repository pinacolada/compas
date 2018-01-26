import { BrowserWindow, app, remote} from "electron";
import { Point, Rectangle, Filter, Matrix } from "./geom";
import { Graphics, Fill, Stroke, Gradient, GradientStop, Color } from "./graph";
/**
 * Renvoie un élément générique
 * @param idEl identifiant de l'élément recherché
 */
const findEl = (idEl: string) => <HTMLElement>document.getElementById(idEl);
/**
 * Renvoie un élément de type Input
 * @param idEl identifiant de l'élément recherché 
 */
const findIn = (idEl: string) => <HTMLInputElement>document.getElementById(idEl);
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
    
    constructor(target:EventDispatcher, type:string, callback:Function) {
        this.target = target;
        this.type = type;
        this.callback = callback;
        this.start();
    }
    handleEvent(e: Event) {
        this.callback(e);
    }
    start(): void {
        this.target.el.addEventListener(this.type, (e)=> this.callback(this.target, e));
    }
    stop(): void {
        this.target.el.removeEventListener(this.type,(e)=> this.callback(this.target, e));
    }
    public match(type:String, callback:Function):boolean {
        return this.type === type && this.callback === callback;
    }
            
    public remove():void 
    {
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
    listeners: Listener[] = [];
    el: HTMLElement;
    constructor(element:HTMLElement) {
        this.el = element;
    }
    /**
     * Valeur numérique d'un attribut
     * @param attrName Attribut dont on veut la valeur numérique
     */
    _getIntAttr(attrName: string): number {
        const attr = this.el.getAttribute(attrName);
        return attr ? parseInt(attr) : 0;
    }
    /**
     * Définit la valeur numérique d'un attribut
     * @param attrName nom de l'attribut
     * @param value valeur (entière) de l'attribut
     */
    _setIntAttr(attrName: string, value:number):void {
        this.el.setAttribute(attrName, value.toString());
    }
    addEventListener(type: string, callback: Function): void {
        if (this.listeners.some((l: Listener) => l.match(type, callback))) return;
        this.listeners.push(new Listener(this, type, callback));
    }
    dispatchEvent(a:Event): void {
        this.listeners.filter(
            (item: Listener) => item.type == a.type).forEach(
            (item: Listener) => item.callback(a));
    }
    removeEventListener(type: string, callback: Function): void {
        var existe = this.listeners.find((l: Listener) => l.match(type, callback));
        if (existe != undefined) existe.remove();
    }

    removeAllListeners(): void {
        this.listeners.forEach((item: Listener) => item.remove());
    }
    setAttr(attrName: string, attrVal: string): void {
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
     * Transparence générale (opacité)
     */
    get alpha(): number {
        let o = this.css.opacity;
        return  o != null ? parseFloat(o) : 1.0;
    }
    set alpha(value: number) {
        this.css.opacity = value.toString();
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
        return parseInt(<string>this.css.borderRadius);
    }
    set borderRadius(value:number) {
        this.css.borderRadius = value+"px";
    }
    /**
    * inset|outset|solid|dotted|dashed|double|groove|ridge|none
    */
    get borderStyle():string {
        return <string>this.css.borderStyle;
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
     * Position de la souris à l'intérieur de l'objet
     */
    get mouseX(): number {
        return parseInt(<string>this.el.getAttribute("mouseX"));
    }
    get mouseY(): number {
        return parseInt(<string>this.el.getAttribute("mouseY"));
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
     * Nom (id) de l'élément 
     */
    get name(): string {
        return this.el.id;
    }
    set name(value: string) {
        this.setAttr("id", value);
    }
    get stage():Stage|null {
        if (this.parent == null) return null;
        return this.parent.stage;
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
            this.dispatchEvent(new Event("pos"));
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
            this.dispatchEvent(new Event("pos"));
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
            this.dispatchEvent(new Event("size"));
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
            this.dispatchEvent(new Event("size"));
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
        this.addEventListener("mousemove", Stage.handleMouse);
        window.addEventListener("resize", (e: UIEvent) => Stage.handleSize(this, e));
        Stage.handleSize(this);
        this.backgroundColor = color;

        this.width = w;
        this.height = h;

    }

    get stage(): Stage {
        return this;
    }

    public static handleSize(stage:Stage, e?:UIEvent) {
        // Mémorise en attribut la taille de la scène (utilisée) 
        stage._setIntAttr("stageWidth", window.innerWidth);
        stage._setIntAttr("stageHeight", window.innerHeight);
        stage.css.width = window.innerWidth + "px";
        stage.css.height = window.innerHeight + "px";
    }

    public static handleMouse(stage: Stage, e: MouseEvent) {
        let hitEl: HTMLElement = e.target as HTMLElement;
        stage.hitElement = hitEl;
        let hitR: ClientRect = hitEl.getBoundingClientRect();
        let [ecX, ecY, mx, my] = [e.clientX, e.clientY, e.clientX - hitR.left, e.clientY-hitR.top];

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
    css: CSSStyleDeclaration;
    span: HTMLSpanElement;
    constructor(name:string="times new roman",
        size: number=12,
        color: number=0x000000,
        bold: boolean=false,
        italic: boolean=false,
        underline: boolean=false,
        align: string="left",
        marginLeft: number=0,
        marginRight: number = 0,
        leading: number = 0,
        letterSpacing: number = 0) {
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
        return parseInt(<string>this.css.fontSize);
    }
    set fontSize(value) {
        this.css.fontSize = value + "pt";
    }
    /**
    * Marge entre le texte et la bordure de droite
    */
    get mgLeft():number {
        return parseInt(<string>this.css.paddingLeft);
    }
    set mgLeft(value:number) {
        this.css.paddingLeft = value + "px";
    }
    /**
    * Marge entre le texte et la bordure de droite
    */
    get mgRight():number {
        return parseInt(<string>this.css.paddingRight);
    }
    set mgRight(value:number) {
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
    get textColor():number {
        return Color.hex(this.css.color ? this.css.color : "rgb(0,0,0)");
    }
    set textColor(value:number) {
        this.css.color = Color.rgb(value);
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
    format: TextFormat;
    private _span: HTMLSpanElement;
    constructor() {
        super(create("div"));
        this.format = new TextFormat();
        this._span = this.format.span;
        this.el.appendChild(this._span);
        this._span.style.width = "100%";
        this._span.style.height = "100%";
    }
    get text(): string {
        return this._span.textContent || "";
    }
    set text(value: string) {
        this._span.textContent = value;
    }
}