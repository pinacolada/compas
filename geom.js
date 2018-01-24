"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Position
 * @author Jean-Marie PETIT
 */
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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
}
exports.Point = Point;
/**
 * Position
 * @author Jean-Marie PETIT
 */
class Rectangle {
    constructor(px = 0, py = 0, w = 0, h = 0) {
        this.setTo(px, py, w, h);
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
        let val = this.css.left;
        return (val == null) ? 0 : parseInt(val);
    }
    set x(value) {
        this.css.left = value + "px";
    }
    get y() {
        let val = this.css.top;
        return (val == null) ? 0 : parseInt(val);
    }
    set y(value) {
        this.css.top = value + "px";
    }
    get width() {
        let val = this.css.width;
        return (val == null) ? 0 : parseInt(val);
    }
    set width(value) {
        this.css.width = value + "px";
    }
    get height() {
        let val = this.css.height;
        return (val == null) ? 0 : parseInt(val);
    }
    set height(value) {
        this.css.height = value + "px";
    }
}
exports.Rectangle = Rectangle;
class Filter {
    constructor() {
    }
}
exports.Filter = Filter;
class Matrix {
    constructor() {
    }
    /**
    * Première valeur
    */
    get a() {
        return this.val[0];
    }
    set a(value) {
        this.val[0] = value;
    }
    /**
    * Première valeur
    */
    get b() {
        return this.val[1];
    }
    set b(value) {
        this.val[1] = value;
    }
    /**
    * Première valeur
    */
    get c() {
        return this.val[2];
    }
    set c(value) {
        this.val[2] = value;
    }
    /**
    * Première valeur
    */
    get d() {
        return this.val[3];
    }
    set d(value) {
        this.val[3] = value;
    }
    /**
* Première valeur
*/
    get tx() {
        return this.val[4];
    }
    set tx(value) {
        this.val[4] = value;
    }
    /**
* Première valeur
*/
    get ty() {
        return this.val[5];
    }
    set ty(value) {
        this.val[5] = value;
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=geom.js.map