"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Position, dimension et transformations
 * @author Jean-Marie PETIT
 */
class Rectangle {
    constructor(css) {
        // disp: DisplayObject;
        this.val = [0, 0, 0, 0, 0, 0, 0, 1, 1]; // x, y, width, height, rotDeg, skewXDeg skewYDeg, scaleX, scaleY
        this.css = css;
        this.css.position = "absolute";
        this.css.boxSizing = "border-box";
        this.css.overflow = "hidden";
        this.css.margin = "0";
        this.css.padding = "0";
    }
    toCss() {
        if (this.css == undefined)
            return;
        this.css.left = this.val[0] + "px";
        this.css.top = this.val[1] + "px";
        this.css.width = this.val[2] + "px";
        this.css.height = this.val[3] + "px";
        this.css.transform = "rotate(" + this.val[4] + "deg)" +
            "skew(" + this.val[5] + "deg, " + this.val[6] + "deg)";
    }
    /**
     * Définit la position et la taille du rectangle
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    setTo(px = 0, py = 0, w = 0, h = 0) {
        this.x = px;
        this.y = py;
        this.width = w;
        this.height = h;
    }
    get style() {
        return this.css;
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
    get x() {
        return this.val[0];
    }
    set x(value) {
        this.val[0] = value;
        this.toCss();
    }
    get y() {
        return this.val[1];
    }
    set y(value) {
        this.val[1] = value;
        this.toCss();
    }
    get width() {
        return this.val[2];
    }
    set width(value) {
        this.val[2] = value;
        this.toCss();
    }
    get height() {
        return this.val[3];
    }
    set height(value) {
        this.val[3] = value;
        this.toCss();
    }
    get rot() {
        return this.val[4];
    }
    set rot(value) {
        this.val[4] = value;
        this.toCss();
    }
    get skX() {
        return this.val[5];
    }
    set skX(value) {
        this.val[5] = value;
        this.toCss();
    }
    get skY() {
        return this.val[6];
    }
    set skY(value) {
        this.val[6] = value;
        this.toCss();
    }
    get scX() {
        return this.val[7];
    }
    set scX(value) {
        this.val[7] = value;
        this.toCss();
    }
    get scY() {
        return this.val[8];
    }
    set scY(value) {
        this.val[8] = value;
        this.toCss();
    }
    toString() {
        return `(x:${this.val[0]},y:${this.val[1]})-(${this.val[2]} x ${this.val[3]})`;
    }
}
exports.Rectangle = Rectangle;
//# sourceMappingURL=geom.js.map