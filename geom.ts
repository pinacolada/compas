import { Graphics } from "./graph";

/**
 * Position
 * @author Jean-Marie PETIT
 */
export class Point {
    constructor(public x: number = 0, public y: number = 0) {  
    }
    setTo(px: number = 0, py: number = 0): void {
        this.x = px;
        this.y = py;
    }
    get left(): number {
        return this.x;
    }
    set left(value: number) {
        this.x = value;
    }
    get top(): number {
        return this.y;
    }
    set top(value: number) {
        this.y = value;
    }
}

/**
 * Position
 * @author Jean-Marie PETIT
 */
export class Rectangle {
    css: CSSStyleDeclaration;

    constructor(px:number = 0, py: number = 0, w: number = 0, h: number = 0) {
        this.setTo(px, py, w, h);
    }
    /**
     * Définit la position et la taille du rectangle
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    setTo(px: number = 0, py: number = 0, w: number = 0, h: number = 0): void {
        if (this.css == undefined) return;
        this.x = px;
        this.y = py;
        this.width = w;
        this.height = h;
    }
    get style(): CSSStyleDeclaration {
        return this.css;
    }
    set style(value:CSSStyleDeclaration) {
        this.css = value;
        this.css.position = "absolute";
        this.css.boxSizing = "border-box";
    }
    get left(): number {
        return this.x;
    }
    set left(value: number) {
        this.x = value; 
    }
    get top(): number {
        return this.y;
    }
    set top(value: number) {
        this.y = value;
    }
    get right(): number {
        return this.x + this.width;
    }
    get bottom(): number {
        return this.y + this.height;
    }
    get topLeft(): Point {
        return new Point(this.x, this.y);
    }
    get topRight(): Point {
        return new Point(this.right, this.y);
    }
    get bottomLeft(): Point {
        return new Point(this.x, this.bottom);
    }
    get bottomRight(): Point {
        return new Point(this.right, this.bottom);
    }
    get x(): number {
        let val = this.css.left;
        return (val == null) ? 0 : parseInt(val);
    }
    set x(value: number) {
        this.css.left = value + "px";
    }
    get y(): number {
        let val = this.css.top;
        return (val == null) ? 0 : parseInt(val);
    }
    set y(value: number) {
        this.css.top = value + "px";
    }
    get width(): number {
        let val = this.css.width;
        return (val == null) ? 0 : parseInt(val);
    }
    set width(value: number) {
        this.css.width = value + "px";
    }
    get height(): number {
        let val = this.css.height;
        return (val == null) ? 0 : parseInt(val);
    }
    set height(value: number) {
        this.css.height = value + "px";
    }
}

export class Filter {
    constructor() {

    }
}

export class Matrix {
    private val: number[];

    constructor() {

    }
    /**
    * Première valeur
    */
    get a():number {
      return this.val[0];
    }
    set a(value:number) {
      this.val[0] = value;
    }
    /**
    * Première valeur
    */
    get b():number {
        return this.val[1];
      }
    set b(value:number) {
        this.val[1] = value;
    }
    /**
    * Première valeur
    */
    get c():number {
        return this.val[2];
      }
    set c(value:number) {
        this.val[2] = value;
    }
    /**
    * Première valeur
    */
    get d():number {
        return this.val[3];
      }
    set d(value:number) {
        this.val[3] = value;
    }
        /**
    * Première valeur
    */
    get tx():number {
        return this.val[4];
      }
    set tx(value:number) {
        this.val[4] = value;
    }
        /**
    * Première valeur
    */
    get ty():number {
        return this.val[5];
      }
    set ty(value:number) {
        this.val[5] = value;
    }
}