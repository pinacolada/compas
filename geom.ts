import { Graphics } from "./graph";
import { DisplayObject } from "./display";

/**
 * Position
 * @author Jean-Marie PETIT
 */
export class Point {
    pt: SVGPoint;
    constructor(px: number = 0, py: number = 0) {
        let svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.pt = Point.Create(px, py);
    }
    static Create(px:number, py:number):SVGPoint {
        let svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let p = svg.createSVGPoint();
        p.x = px;
        p.y = py;
        return p;
    }
    matrixTransform(mat: Matrix): Point {
        let alt = this.pt.matrixTransform(mat.m);
        return new Point(alt.x, alt.y);
    }
    get x(): number {
        return this.pt.x;
    }
    set x(value: number) {
        this.pt.x = value;
    }
    get y(): number {
        return this.pt.y;
    }
    set y(value: number) {
        this.pt.y = value;
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
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

/**
 * Position
 * @author Jean-Marie PETIT
 */
export class Rectangle {
    css: CSSStyleDeclaration;
    disp: DisplayObject;
    rect: SVGRect;
    constructor(px:number = 0, py: number = 0, w: number = 0, h: number = 0) {
        this.rect = Rectangle.Create(px, py, w, h);
    }
    static Create(px: number, py: number, w: number, h: number) {
        let svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let r: SVGRect = svg.createSVGRect();
        r.x = px;
        r.y = py;
        r.width = w;
        r.height = h;
        return r;
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
        this.css.overflow = "hidden";
        this.css.margin = "0";
        this.css.padding = "0";
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
        return this.rect.x;
    }
    set x(value: number) {
        this.rect.x = value;
        this.css.left = this.rect.x + "px";
    }
    get y(): number {
        return this.rect.y;
    }
    set y(value: number) {
        this.rect.y = value;
        this.css.top = this.rect.y + "px";
    }
    get width(): number {
        return this.rect.width;
    }
    set width(value: number) {
        this.rect.width = value;
        this.css.width = this.rect.width + "px";
    }
    get height(): number {
        return this.rect.height;
    }
    set height(value: number) {
        this.rect.height = value;
        this.css.height = this.rect.height + "px";
    }
    toString(): string {
        let r = this.rect;
        return `(x:${r.x},y:${r.y})-(${r.width} x ${r.height})`;
    }
    clone(): Rectangle {
        let r = this.rect;
        return new Rectangle(r.x, r.y, r.width, r.height);
    }
}

export class Filter {
    constructor() {

    }
}

export class Matrix {
    m: SVGMatrix;
    constructor(a:number, b:number, c:number, d:number, tx:number, ty:number) {
        this.m = Matrix.Create();
        this.setTo(a, b, c, d, tx, ty);
    }
    static Create():SVGMatrix {
        let svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        return svg.createSVGMatrix();
    }
    static Copy(m: SVGMatrix): SVGMatrix {
        let alt = Matrix.Create();
        alt.a = m.a;
        alt.b = m.b;
        alt.c = m.c;
        alt.d = m.d;
        alt.e = m.e;
        alt.f = m.f;
        return alt
    }
    static With(m: SVGMatrix): Matrix {
        return new Matrix(m.a, m.b, m.c, m.d, m.e, m.f);
    }

    setTo(a:number, b:number, c:number, d:number, tx:number, ty:number) {
        this.m.a = a;
        this.m.b = b;
        this.m.c = c;
        this.m.d = d;
        this.m.e = tx;
        this.m.f = ty;        
    }
    multiply(secondMatrix: Matrix): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.multiply(secondMatrix.m));
    }
    inverse(): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.inverse());
    }
    translate(x: number, y: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.translate(x, y));
    }
    scale(scaleFactor: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.scale(scaleFactor));
    }
    scaleNonUniform(scaleFactorX: number, scaleFactorY: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.scaleNonUniform(scaleFactorX, scaleFactorY));
    }
    rotate(angle: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.rotate(angle));
    }
    rotateFromVector(x: number, y: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.rotateFromVector(x, y));
    }
    flipX(): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.flipX());
    }
    flipY(): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.flipY());
    }
    skewX(angle: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.skewX(angle));
    }
    skewY(angle: number): Matrix {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.skewY(angle));
    }
    /**
    * Première valeur
    */
    get a():number {
      return this.m.a;
    }
    set a(value:number) {
      this.m.a = value;
    }
    /**
    * Seconde valeur
    */
    get b():number {
        return this.m.b;
      }
    set b(value:number) {
        this.m.b = value;
    }
    /**
    * Troisième valeur
    */
    get c():number {
        return this.m.c;
      }
    set c(value:number) {
        this.m.c = value;
    }
    /**
    * Quatrième valeur
    */
    get d():number {
        return this.m.d;
      }
    set d(value:number) {
        this.m.d = value;
    }
    /**
    * Cinquième valeur
    */
    get tx():number {
        return this.m.e;
      }
    set tx(value:number) {
        this.m.e = value;
    }
    /**
    * Sixième valeur
    */
    get ty():number {
        return this.m.f;
    }
    set ty(value:number) {
        this.m.f = value;
    }
}