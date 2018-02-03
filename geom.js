"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Position
 * @author Jean-Marie PETIT
 */
class Point {
    constructor(px = 0, py = 0) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.pt = Point.Create(px, py);
    }
    static Create(px, py) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let p = svg.createSVGPoint();
        p.x = px;
        p.y = py;
        return p;
    }
    matrixTransform(mat) {
        let alt = this.pt.matrixTransform(mat.m);
        return new Point(alt.x, alt.y);
    }
    get x() {
        return this.pt.x;
    }
    set x(value) {
        this.pt.x = value;
    }
    get y() {
        return this.pt.y;
    }
    set y(value) {
        this.pt.y = value;
    }
    setTo(px = 0, py = 0) {
        this.x = px;
        this.y = py;
    }
    get left() {
        return this.x;
    }
    set left(value) {
        this.x = value;
    }
    get top() {
        return this.y;
    }
    set top(value) {
        this.y = value;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
exports.Point = Point;
/**
 * Position
 * @author Jean-Marie PETIT
 */
class Rectangle {
    constructor(px = 0, py = 0, w = 0, h = 0) {
        this.rect = Rectangle.Create(px, py, w, h);
    }
    static Create(px, py, w, h) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let r = svg.createSVGRect();
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
    setTo(px = 0, py = 0, w = 0, h = 0) {
        if (this.css == undefined)
            return;
        this.x = px;
        this.y = py;
        this.width = w;
        this.height = h;
    }
    get style() {
        return this.css;
    }
    set style(value) {
        this.css = value;
        this.css.position = "absolute";
        this.css.boxSizing = "border-box";
        this.css.overflow = "hidden";
        this.css.margin = "0";
        this.css.padding = "0";
    }
    get left() {
        return this.x;
    }
    set left(value) {
        this.x = value;
    }
    get top() {
        return this.y;
    }
    set top(value) {
        this.y = value;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    get topLeft() {
        return new Point(this.x, this.y);
    }
    get topRight() {
        return new Point(this.right, this.y);
    }
    get bottomLeft() {
        return new Point(this.x, this.bottom);
    }
    get bottomRight() {
        return new Point(this.right, this.bottom);
    }
    get x() {
        return this.rect.x;
    }
    set x(value) {
        this.rect.x = value;
        this.css.left = this.rect.x + "px";
    }
    get y() {
        return this.rect.y;
    }
    set y(value) {
        this.rect.y = value;
        this.css.top = this.rect.y + "px";
    }
    get width() {
        return this.rect.width;
    }
    set width(value) {
        this.rect.width = value;
        this.css.width = this.rect.width + "px";
    }
    get height() {
        return this.rect.height;
    }
    set height(value) {
        this.rect.height = value;
        this.css.height = this.rect.height + "px";
    }
    toString() {
        let r = this.rect;
        return `(x:${r.x},y:${r.y})-(${r.width} x ${r.height})`;
    }
    clone() {
        let r = this.rect;
        return new Rectangle(r.x, r.y, r.width, r.height);
    }
}
exports.Rectangle = Rectangle;
class Filter {
    constructor() {
    }
}
exports.Filter = Filter;
class Matrix {
    constructor(a, b, c, d, tx, ty) {
        this.m = Matrix.Create();
        this.setTo(a, b, c, d, tx, ty);
    }
    static Create() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        return svg.createSVGMatrix();
    }
    static Copy(m) {
        let alt = Matrix.Create();
        alt.a = m.a;
        alt.b = m.b;
        alt.c = m.c;
        alt.d = m.d;
        alt.e = m.e;
        alt.f = m.f;
        return alt;
    }
    static With(m) {
        return new Matrix(m.a, m.b, m.c, m.d, m.e, m.f);
    }
    setTo(a, b, c, d, tx, ty) {
        this.m.a = a;
        this.m.b = b;
        this.m.c = c;
        this.m.d = d;
        this.m.e = tx;
        this.m.f = ty;
    }
    multiply(secondMatrix) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.multiply(secondMatrix.m));
    }
    inverse() {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.inverse());
    }
    translate(x, y) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.translate(x, y));
    }
    scale(scaleFactor) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.scale(scaleFactor));
    }
    scaleNonUniform(scaleFactorX, scaleFactorY) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.scaleNonUniform(scaleFactorX, scaleFactorY));
    }
    rotate(angle) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.rotate(angle));
    }
    rotateFromVector(x, y) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.rotateFromVector(x, y));
    }
    flipX() {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.flipX());
    }
    flipY() {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.flipY());
    }
    skewX(angle) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.skewX(angle));
    }
    skewY(angle) {
        let m = Matrix.Copy(this.m);
        return Matrix.With(m.skewY(angle));
    }
    /**
    * Première valeur
    */
    get a() {
        return this.m.a;
    }
    set a(value) {
        this.m.a = value;
    }
    /**
    * Seconde valeur
    */
    get b() {
        return this.m.b;
    }
    set b(value) {
        this.m.b = value;
    }
    /**
    * Troisième valeur
    */
    get c() {
        return this.m.c;
    }
    set c(value) {
        this.m.c = value;
    }
    /**
    * Quatrième valeur
    */
    get d() {
        return this.m.d;
    }
    set d(value) {
        this.m.d = value;
    }
    /**
    * Cinquième valeur
    */
    get tx() {
        return this.m.e;
    }
    set tx(value) {
        this.m.e = value;
    }
    /**
    * Sixième valeur
    */
    get ty() {
        return this.m.f;
    }
    set ty(value) {
        this.m.f = value;
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=geom.js.map