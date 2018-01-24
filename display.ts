import { BrowserWindow, app, remote} from "electron";
import { Point, Rectangle, Filter, Matrix } from "./geom";
import { Graphics, Fill, Stroke, Gradient, GradientStop } from "./graph";

const find = (idEl:string, T) => document.getElementById(idEl) as T;
const create = (type:string)=> document.createElement(type);

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

/**
 * Diffuseur/écouteur d'événements générique
 * @author Jean-Marie PETIT
 */
class EventDispatcher {
    listeners: Listener[];
    el: HTMLElement;
    constructor(element:HTMLElement) {
        this.listeners = [];
        this.el = element;
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
    el: HTMLElement;
    constructor( element:HTMLElement) {
        super(element);
        this.css = this.el.style
        this.rect = new Rectangle();
        this.rect.style = this.css;
        this.back = new Fill();
        this.border = new Stroke(); 
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
    gradientBackground(colors:number[],alphas:number[],ratios:number[],angle:number): DisplayObject {
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
    * Style de la bordure
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
        this.rect.x = value;
    }
    /**
     * Haut du DisplayObject (dans son parent)
     */
    get y(): number {
        return this.rect.y;
    }
    set y(value: number) {
        this.rect.y = value;
    }
    /**
     * Largeur du DisplayBoject
     */
    get width(): number {
        return this.rect.width;
    }
    set width(value: number) {
        this.rect.width = value;
    }
    /**
     * Hauteur du DisplayObject
     */
    get height(): number {
        return this.rect.height;
    }
    set height(value: number) {
        this.rect.height = value;
    }
}

/**
 * Objet réactif
 * @author Jean-Marie PETIT
 */
class InteractiveObject extends DisplayObject {
    _mouseEnabled: boolean;
    _tabEnabled: boolean;
    tabIndex: number;

    constructor(element:HTMLElement) {
        super(element);
    }

    get mouseEnabled(): boolean {
        return this._mouseEnabled;
    }

    set mouseEnabled(value: boolean) {
        this._mouseEnabled = value;
    }

    get tabEnabled(): boolean {
        return this._tabEnabled;
    }

    set tabEnabled(value: boolean) {
        this._tabEnabled = value;
    }
}

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

/**
 * Elément visuel avec interface graphique
 * @author Jean-Marie PETIT
 */
export class Shape extends DisplayObject {
    graphics: Graphics;
    constructor() {
        super(create("div"));
        this.graphics = new Graphics(this.el);
    }
}
/**
 * Élément d'arrière-plan de page (= document.body)
 */
export class Stage extends DisplayObjectContainer {
    /**
     * Élement en cours (survolé par la souris)
     */
    hitElement: HTMLElement;
    constructor(w:number, h:number, color:number) {
        super(document.body);
        this.name = "stage";
        this.addEventListener("mousemove", Stage.handleMouse);
        window.addEventListener("resize", (e: UIEvent) => Stage.handleSize(this, e));
        Stage.handleSize(this);
        
        
        this.backgroundColor = color;
    }

    get stage(): Stage {
        return this;
    }

    public static handleSize(stage:Stage, e?:UIEvent) {
        // Mémorise en attribut la taille de la scène (utilisée) 
        stage.setAttr("stageWidth", window.innerWidth.toString());
        stage.setAttr("stageHeight", window.innerHeight.toString());
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
    get stageX(): number {
        return parseInt(this.el.getAttribute("stageX") as string);
    }
    /**
    * Position verticale de la souris sur la scène
    */
    get stageY(): number {
        return parseInt(this.el.getAttribute("stageY") as string);
    }

    get stageWidth(): number {
        return parseInt(this.el.getAttribute("stageWidth") as string);
    }

    get stageHeight(): number {
        return parseInt(this.el.getAttribute("stageHeight") as string);
    }
}

/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
export class Sprite extends DisplayObjectContainer {
    graphics: Graphics;
    constructor() {
        super(create("div"));
        this.graphics = new Graphics(this.el);
    }
}

export class TextFormat {
    css: CSSStyleDeclaration;

    constructor(public name:string="times new roman",
        public size: number=12,
        public color: number=0x000000,
        public bold: boolean=false,
        public italic: boolean=false,
        public underline: boolean=false,
        public align: string="left",
        public marginLeft: number=0,
        public marginRight: number = 0,
        public leading: number = 0,
        public letterSpacing: number = 0) {
        
    }
    applyOn(style:CSSStyleDeclaration) {
        this.css = style;
    }
}
/**
 * Élément visuel interactif avec interface graphique
 * pouvant contenir d'autres éléments
 * @author Jean-Marie PETIT
 */
export class TextField extends DisplayObject {
    graphics: Graphics;
    format: TextFormat;
    constructor() {
        super(create("div"));
        this.format = new TextFormat();
        this.format.applyOn(this.el.style);
    }
}